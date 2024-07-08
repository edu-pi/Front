import { useState, useContext, useEffect } from "react";
import { PreprocessedCodesContext } from "../../Home";
import _ from "lodash";

// 타입 정의
import { CodeItem } from "@/types/codeItem";
import { AllObjectItem } from "@/types/allObjectItem";
import { ActivateItem } from "@/types/activateItem";

// utils폴더에서 가져온 함수
import { addCodeFlow } from "./utils/addCodeFlow";
import { updateCodeFlow } from "./utils/updateCodeFlow";
import { turnLight } from "./utils/turnLight";
import { createNewObject } from "./utils/createNewObject";
import { updateDataStructure } from "./utils/updateDataStructure";
import { updateActivate } from "./utils/updateActivate";

//rendUtils에서 가져온 함수
import { renderingStructure } from "./rendering/renderingStructure";
import { renderingCodeFlow } from "./rendering/renderingCodeFLow";
import { VariablesItem } from "@/types/variablesItem";
interface State {
  objects: AllObjectItem[];
}

const RightSection = () => {
  const [idx, setIdx] = useState<number>(-1);

  // 코드흐름 시각화 정보의 한단계 한단계 모두를 담아두는 리스트
  const [codeFlowList, setCodeFlowList] = useState<State[]>([
    {
      objects: [{ id: 0, type: "start", depth: 0, isLight: false, child: [] }],
    },
  ]);

  const [StructuresList, setStructuresList] = useState<CodeItem[][]>([[]]); // 변수 데이터 시각화 리스트의 변화과정을 담아두는 리스트

  // context API로 데이터 가져오기
  // context API를 사용하는 패턴
  const context = useContext(PreprocessedCodesContext);
  //context가 없을 경우 에러 출력 패턴 처리안해주면 에러 발생
  if (!context) {
    throw new Error("CodeContext not found");
  }
  const { preprocessedCodes } = context;

  // codeFlowList를 업데이트하는 useEffect
  useEffect(() => {
    let activate: ActivateItem[] = [];
    const usedId: number[] = []; // 한 번 사용한 id를 저장하는 리스트
    const usedName: string[] = []; // 한 번 사용한 name을 저장하는 리스트
    let accCodeFlow: State = {
      objects: [{ id: 0, type: "start", depth: 0, isLight: false, child: [] }],
    };
    let accStructures: CodeItem[] = [];
    const accCodeFlowList: State[] = [];
    const accStructuresList: CodeItem[][] = [];
    for (let preprocessedCode of preprocessedCodes) {
      // 임시로 코드흐름 시각화 정보를 담아둘 리스트를 미리 선언
      let changedCodeFlows: AllObjectItem[] = [];

      // 자료구조 시각화 부분이 들어왔을 때
      if (preprocessedCode.type.toLowerCase() === "assignViz".toLowerCase()) {
        preprocessedCode.variables?.forEach((variable: VariablesItem) => {
          // 이미 한번 자료구조 시각화에 표현된 name인 경우
          if (usedName.includes(variable.name!)) {
            const targetName = variable.name!;

            accStructures = updateDataStructure(
              targetName,
              accStructures,
              variable
            );
            accStructures;
          }
          // 처음 시각화해주는 자료구조인 경우
          else {
            accStructures.push(variable as CodeItem);
            usedName.push(variable.name!);
          }
        });
      }
      // 코드 시각화 부분이 들어왔을 때
      else {
        const newObject = createNewObject(preprocessedCode);

        // 한번 codeFlow list에 들어가서 수정하는 입력일 때
        if (usedId.includes(preprocessedCode.id!)) {
          // updateCodeFlow(이전 코드흐름 데이터, 새로 수정해야하는 객체 데이터)
          changedCodeFlows = updateCodeFlow(accCodeFlow.objects, newObject);
        }
        // 처음 codeFlow list에 들어가서 더해야하는 입력일 때
        else {
          // 한번 사용한 id는 저장해준다
          usedId.push(newObject.id);
          // addCodeFlow(비주얼 스택, 새로 더해줘야하는 객체 데이터)
          changedCodeFlows = addCodeFlow(accCodeFlow.objects, newObject);
        }
        // 불을 켜줘야하는 부분에 대한 변수
        activate = updateActivate(activate, newObject);

        //코드흐름 시각화 최종 결과물
        const finallyCodeFlow = turnLight(changedCodeFlows, activate);

        accCodeFlow = { objects: finallyCodeFlow };
      }
      // 불을 켜줘야하는 자료구조의의 name을 담는 배열
      let toLightStructures: any;
      if (preprocessedCode.variables === undefined) {
        toLightStructures = [];
      } else {
        toLightStructures = preprocessedCode.variables?.map((element) => {
          return element.name;
        });
      }

      // toLightStructures 를 참고해서 데이터 구조 시각화 데이터 속성 중 isLight가 true인지 false인지 판단해주는 부분
      accStructures = accStructures.map((structure) => ({
        ...structure,
        isLight: toLightStructures?.includes(structure.name), // toLightStructures 에 자료구조 name이 있으면 isLight를 true로 바꿔준다
      }));

      // 얕은 복사 문제가 생겨서 깊은 복사를 해준다
      const deepCloneStructures = _.cloneDeep(accStructures);
      accStructuresList.push(deepCloneStructures);
      accCodeFlowList.push(accCodeFlow);
    }

    setCodeFlowList(accCodeFlowList);
    setStructuresList(accStructuresList);
  }, [preprocessedCodes]);

  const toFront = () => {
    if (idx > codeFlowList.length - 1) {
      return;
    }
    setIdx(idx + 1);
  };
  const toBack = () => {
    if (idx === -1) {
      return;
    }
    setIdx(idx - 1);
  };

  return (
    <div style={{ backgroundColor: "#f4f4f4", width: "100%" }}>
      <button onClick={toBack}>뒤로 가기</button>
      <button onClick={toFront}>앞으로 가기</button>
      <div>
        <ul style={{ display: "flex" }}>
          {StructuresList &&
            StructuresList.length > 0 &&
            idx >= 0 &&
            renderingStructure(StructuresList[idx])}
        </ul>
      </div>
      <ul>
        {codeFlowList &&
          codeFlowList.length > 0 &&
          idx >= 0 &&
          renderingCodeFlow(codeFlowList[idx].objects[0].child)}
      </ul>
    </div>
  );
};

export default RightSection;