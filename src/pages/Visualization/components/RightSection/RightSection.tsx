import { useState, useContext, useEffect, useRef } from "react";
import { PreprocessedCodesContext } from "../../Visualization";
import Split from "react-split";
import _ from "lodash";
import ResizeObserver from "resize-observer-polyfill";
// components
import Arrow from "./components/Arrow/Arrow";

// 타입 정의

import { ActivateItem } from "@/pages/Visualization/types/activateItem";
import { VariablesDto, Variables } from "@/pages/Visualization/types/dto/variablesDto";
import { ForDto } from "@/pages/Visualization/types/dto/forDto";
import { PrintDto } from "@/pages/Visualization/types/dto/printDto";
import { IfElseDto } from "@/pages/Visualization/types/dto/ifElseDto";
import { CodeFlowVariableDto } from "@/pages/Visualization/types/dto/codeFlowVariableDto";
import { PrintItem } from "@/pages/Visualization/types/codeFlow/printItem";

import { WhileDto } from "@/pages/Visualization/types/dto/whileDto";
import { AllDataStructureItem } from "@/pages/Visualization/types/dataStructuresItem/allDataStructureItem";
import { WarperDataStructureItem } from "@/pages/Visualization/types/dataStructuresItem/warperDataStructureItem";
import { CreateCallStackDto } from "@/pages/Visualization/types/dto/createCallStackDto";
import { EndUserFuncDto } from "@/pages/Visualization/types/dto/endUserFuncDto";
import { usedNameObjectType } from "../../types/dataStructuresItem/usedNameObjectType";

// services폴더에서 가져온 함수
import { addCodeFlow } from "./services/addCodeFlow";
import { insertIntoDepth } from "./services/insertIntoDepth";
import { insertEqualToDepth } from "./services/insertEqualToDepth";
import { updateCodeFlow } from "./services/updateCodeFlow";
import { turnLight } from "./services/turnLight";
import { createObjectToAdd } from "./services/createObjectToAdd";
import { updateDataStructure } from "./services/updateDataStructure";
import { updateActivate } from "./services/updateActivate";
import { turnOffAllNodeLight } from "./services/turnOffAllNodeLight";
import { findTargetChild } from "./services/findTargetChild";
import { findDeleteUsedId } from "./services/findDeleteUsedId";
import { unLightCodeFlow } from "./services/unLightCodeFlow";

//rendUtils에서 가져온 함수
import { renderingStructure } from "./renderingStructure";
import { renderingCodeFlow } from "./renderingCodeFlow";
import { IfElseChangeDto } from "@/pages/Visualization/types/dto/ifElseChangeDto";
import { refreshCodeFlow } from "./services/refreshCodeFlow";
import { deleteCodeFlow } from "./services/deleteCodeFlow";

//zustand store
import { useConsoleStore, useCodeFlowLengthStore } from "@/store/console";
import { useRightSectionStore } from "@/store/arrow";
import { useEditorStore } from "@/store/editor";

interface State {
  objects: any[];
}

const RightSection = () => {
  const [codeFlowList, setCodeFlowList] = useState<State[]>([
    {
      objects: [{ id: 0, type: "start", depth: 0, isLight: false, child: [] }],
    },
  ]);
  const [StructuresList, setStructuresList] = useState<any>([]); // 변수 데이터 시각화 리스트의 변화과정을 담아두는 리스트
  const context = useContext(PreprocessedCodesContext); // context API로 데이터 가져오기
  if (!context) {
    throw new Error("CodeContext not found"); //context가 없을 경우 에러 출력 패턴 처리안해주면 에러 발생
  }
  const setConsole = useConsoleStore((state) => state.setConsole);
  const stepIdx = useConsoleStore((state) => state.stepIdx);
  const setCodeFlowLength = useCodeFlowLengthStore((state) => state.setCodeFlowLength);
  const { preprocessedCodes } = context;

  const [arrowTextList, setArrowTextList] = useState<string[]>([]);

  const [, setRightSectionSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  const rightSectionRef = useRef<HTMLDivElement | null>(null);
  const rightSection2Ref = useRef<HTMLDivElement | null>(null);

  const setWidth = useRightSectionStore((state) => state.setWidth);
  const setHeight = useRightSectionStore((state) => state.setHeight);

  const width = useRightSectionStore((state) => state.width);
  const height = useRightSectionStore((state) => state.height);
  const setHighlightLines = useEditorStore((state) => state.setHighlightLines);

  useEffect(() => {
    if (!rightSectionRef.current) return;
    const resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setRightSectionSize({ width, height });
        setWidth(width);
        setHeight(height);
      }
    });
    resizeObserver.observe(rightSectionRef.current);

    return () => {
      if (rightSectionRef.current) {
        resizeObserver.unobserve(rightSectionRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!rightSection2Ref.current) return;
    const resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setRightSectionSize({ width, height });
        setWidth(width);
        setHeight(height);
      }
    });
    resizeObserver.observe(rightSection2Ref.current);

    return () => {
      if (rightSection2Ref.current) {
        resizeObserver.unobserve(rightSection2Ref.current);
      }
    };
  }, []);
  // 시각화를 할때 왼쪽 코드 에디터에서 하이라이트를 줄 라인을 담는 배열
  const highlightLine: number[] = [];
  // codeFlowList를 업데이트하는 useEffect
  useEffect(() => {
    let prevTrackingId: number = 0;
    let prevTrackingDepth: number = 0;
    let activate: ActivateItem[] = [];
    let usedId: number[] = [];
    const usedName: usedNameObjectType = { main: [] };
    let accCodeFlow: State = {
      objects: [{ id: 0, type: "start", depth: 0, isLight: false, child: [] }],
    };
    let accDataStructures: WarperDataStructureItem = {
      main: { data: [], isLight: false },
    };

    const accCodeFlowList: State[] = [];
    const accDataStructuresList: AllDataStructureItem = [];
    const accConsoleLogList: string[] = [];
    let accConsoleLog: string = "";
    const arrowTexts: string[] = [];
    for (let preprocessedCode of preprocessedCodes) {
      let changedCodeFlows: any[] = [];
      if (preprocessedCode.type.toLowerCase() === "whiledefine") {
        continue;
      }

      accDataStructures = Object.entries(accDataStructures).reduce((acc, [key, value]) => {
        acc[key] = {
          data: value.data.map((structure) => ({
            ...structure,
          })),
          isLight: false,
        };
        return acc;
      }, {} as WarperDataStructureItem);
      // enduserFunc 타입이 들어왔을 때 코드흐름과 변수 부분 함수를 지우고 return value를 나타나게 한다
      // 나타나고 바로 사라지는건 traking id와 depth를 사용하지 않는다
      if (preprocessedCode.type.toLowerCase() === "endUserFunc".toLowerCase()) {
        const delName = (preprocessedCode as EndUserFuncDto).delFuncName;
        delete accDataStructures[delName]; // 함수 이름을 키로 가지는 객체를 삭제
        delete usedName[delName];
        const toAddObject = createObjectToAdd(preprocessedCode as EndUserFuncDto);

        // isLight를 true로 바꿔준다
        toAddObject.isLight = true;

        let finallyCodeFlow: any;
        let deletedCodeFlow = deleteCodeFlow(accCodeFlow.objects, (preprocessedCode as EndUserFuncDto).id);
        accCodeFlow = { objects: deletedCodeFlow };
        if (toAddObject.depth > prevTrackingDepth) {
          finallyCodeFlow = insertIntoDepth(accCodeFlow.objects, toAddObject, prevTrackingId);
        } else if (toAddObject.depth === prevTrackingDepth) {
          finallyCodeFlow = insertEqualToDepth(accCodeFlow.objects, toAddObject, prevTrackingId);
        } else {
          finallyCodeFlow = addCodeFlow(accCodeFlow.objects, toAddObject);
        }

        accCodeFlow = { objects: finallyCodeFlow };
        arrowTexts.push((preprocessedCode as EndUserFuncDto).code);
      }
      // 자료구조 시각화 부분이 들어왔을 때
      // 나타나고 바로 사라지는건 traking id와 depth를 사용하지 않는다ㄴ
      else if (preprocessedCode.type.toLowerCase() === "assign".toLowerCase()) {
        const callStackName = (preprocessedCode as VariablesDto).callStackName;
        // 오른쪽에 변수로 함수를 넣을 때
        if ((preprocessedCode as VariablesDto).variables[0].type.toLowerCase() === "function".toLowerCase()) {
          const { id, expr, name, type, code } = (preprocessedCode as VariablesDto).variables[0];
          accDataStructures[callStackName].data.push({ id, expr, name, type });

          arrowTexts.push(code);
        } else {
          (preprocessedCode as VariablesDto).variables.forEach((variable: Variables) => {
            highlightLine.push(variable.id);
            // 자료구조 시각화에서 화살표에 넣을 코드를 넣는다
            arrowTexts.push(variable.code);
            // 이미 한번 자료구조 시각화에 표현된 name인 경우
            if (usedName[callStackName].includes(variable.name!)) {
              const targetName = variable.name!;

              accDataStructures = updateDataStructure(targetName, accDataStructures, variable, callStackName);
            }
            // 처음 시각화해주는 자료구조인 경우
            else {
              accDataStructures[callStackName].data.push(variable);
              usedName[callStackName].push(variable.name!);
            }

            // 코드 흐름 시각화에서 표현된 자료구조 시각화 객체를 삭제하는 부분
            let deletedCodeFlow = deleteCodeFlow(accCodeFlow.objects, variable.id!);
            usedId = usedId.filter((id) => id !== variable.id);
            accCodeFlow = { objects: deletedCodeFlow };
          });
        }
      }
      // 함수 생성으로 새로운 함수 콜스택이 나올 떄
      else if (preprocessedCode.type.toLowerCase() === "createCallStack".toLowerCase()) {
        accDataStructures[(preprocessedCode as CreateCallStackDto).callStackName] = { data: [], isLight: false };
        for (let arg of (preprocessedCode as CreateCallStackDto).args) {
          accDataStructures[(preprocessedCode as CreateCallStackDto).callStackName].data.push({
            expr: arg.expr,
            name: arg.name,
            type: arg.type,
          });
        }
        arrowTexts.push((preprocessedCode as CreateCallStackDto).code);

        accDataStructures[(preprocessedCode as CreateCallStackDto).callStackName].isLight = true;
        usedName[(preprocessedCode as CreateCallStackDto).callStackName] = [];
      }

      // 코드 시각화 부분이 들어왔을 때
      else {
        // ifelseDefine 타입
        if (preprocessedCode.type.toLowerCase() === "ifElseDefine".toLocaleLowerCase()) {
          // ifelseDefine에서 화살표에 넣을 코드를 넣는다
          arrowTexts.push((preprocessedCode as IfElseDto).code);

          highlightLine.push((preprocessedCode as IfElseDto).conditions[0].id);
          // ifelse가 들어왔을 때 한번에 모든 노드의 Light를 다 false로  바꿔주는 함수
          const turnoff = turnOffAllNodeLight(accCodeFlow.objects);

          accCodeFlow = { objects: turnoff };
          for (let condition of (preprocessedCode as IfElseDto).conditions) {
            // ifelse 타입의 객체에 depth를 추가해주는 부분
            const ifElseItem = Object.assign(condition, {
              depth: (preprocessedCode as IfElseDto).depth,
              code: (preprocessedCode as IfElseDto).code,
            });
            // ifelse 타입의 객체를 만들어주는 함수
            const toAddObject = createObjectToAdd(ifElseItem);

            // isLight를 true로 바꿔준다
            toAddObject.isLight = true;
            let finallyCodeFlow: any;

            usedId.push(toAddObject.id);
            if (toAddObject.depth > prevTrackingDepth) {
              finallyCodeFlow = insertIntoDepth(accCodeFlow.objects, toAddObject, prevTrackingId);
            } else if (toAddObject.depth === prevTrackingDepth) {
              finallyCodeFlow = insertEqualToDepth(accCodeFlow.objects, toAddObject, prevTrackingId);
            } else {
              finallyCodeFlow = addCodeFlow(accCodeFlow.objects, toAddObject);
            }

            accCodeFlow = { objects: finallyCodeFlow };

            prevTrackingId = toAddObject.id;
            prevTrackingDepth = toAddObject.depth;
          }
        }
        //그밖의 타입
        else {
          // 그밖의 타입에서 화살표에 넣을 코드를 넣는다

          arrowTexts.push((preprocessedCode as ForDto | PrintDto | IfElseChangeDto | CodeFlowVariableDto).code);
          highlightLine.push((preprocessedCode as ForDto | PrintDto | IfElseChangeDto | CodeFlowVariableDto).id);

          const toAddObject = createObjectToAdd(
            preprocessedCode as ForDto | PrintDto | IfElseChangeDto | CodeFlowVariableDto
          );

          // print 타입일 때 console창의 로그를 만드는 부분
          if ((toAddObject as PrintItem).type === "print") {
            const printObject = toAddObject as PrintItem;
            if (printObject.console !== null) {
              accConsoleLog += printObject.console;
            }
          }
          // 한번 codeFlow list에 들어가서 수정하는 입력일 때
          if (usedId.includes(toAddObject.id!)) {
            // 한바퀴 돌아서 안에 있는 내용을 초기화해야 하는 부분이면 여기에서 처리해준다
            if (toAddObject.type === "for" || toAddObject.type === "while") {
              const targetChild = findTargetChild(accCodeFlow.objects, toAddObject); // 지워야하는 부분까지 트리를 잘라서 리턴하는 함수
              const idsToDelete = findDeleteUsedId(targetChild); // 지워야하는 부분의 트리를 순회해서  id를 리턴하는 함수
              usedId = usedId.filter((id) => !idsToDelete.includes(id));
              changedCodeFlows = refreshCodeFlow(accCodeFlow.objects, toAddObject); // 반복문 안쪽 child를 초기화해주는 부분
            } else {
              changedCodeFlows = updateCodeFlow(accCodeFlow.objects, toAddObject);
            }
          }
          // 처음 codeFlow list에 들어가서 더해야하는 입력일 때
          else {
            usedId.push(toAddObject.id);
            if (toAddObject.depth > prevTrackingDepth) {
              changedCodeFlows = insertIntoDepth(accCodeFlow.objects, toAddObject, prevTrackingId);
            } else if (toAddObject.depth === prevTrackingDepth) {
              changedCodeFlows = insertEqualToDepth(accCodeFlow.objects, toAddObject, prevTrackingId);
            } else {
              changedCodeFlows = addCodeFlow(accCodeFlow.objects, toAddObject);
            }
          }
          activate = updateActivate(activate, toAddObject);
          const finallyCodeFlow = turnLight(changedCodeFlows, activate);

          accCodeFlow = { objects: finallyCodeFlow };
          if (toAddObject.type !== "variable" && toAddObject.type !== "list") {
            prevTrackingDepth = (
              preprocessedCode as ForDto | PrintDto | IfElseChangeDto | CodeFlowVariableDto | WhileDto
            ).depth;
            prevTrackingId = (preprocessedCode as ForDto | PrintDto | IfElseChangeDto | CodeFlowVariableDto | WhileDto)
              .id;
          }
        }
      }

      // 불을 켜줘야하는 자료구조의의 name을 담는 배열
      let toLightStructures: any = {};
      if (preprocessedCode.type.toLowerCase() === "assign".toLowerCase()) {
        (preprocessedCode as VariablesDto).variables?.forEach((element) => {
          const callStackName = (preprocessedCode as VariablesDto).callStackName;
          // ToLightStructures에 키가 없으면 초기화
          if (!toLightStructures[callStackName]) {
            toLightStructures[callStackName] = [];
          }

          toLightStructures[callStackName].push(element.name);
        });
      }

      if (preprocessedCode.type.toLowerCase() === "createCallStack".toLowerCase()) {
        (preprocessedCode as CreateCallStackDto).args?.forEach((element) => {
          const callStackName = (preprocessedCode as CreateCallStackDto).callStackName;
          // ToLightStructures에 키가 없으면 초기화
          if (!toLightStructures[callStackName]) {
            toLightStructures[callStackName] = [];
          }
          toLightStructures[callStackName].push(element.name);
        });
        // 함수 생성시 콜스택이 변수 시각화에 나타나고 코드흐름은 하이라이트를 끄기 위해 사용
        const unLightaccCodeFlow = unLightCodeFlow(accCodeFlow.objects);
        accCodeFlow = { objects: unLightaccCodeFlow };
      }

      const updatedAccDataStructures: WarperDataStructureItem = Object.entries(accDataStructures).reduce(
        (acc, [key, value]) => {
          acc[key] = {
            data: value.data.map((structure) => ({
              ...structure,
              isLight: toLightStructures[key]?.includes(structure.name) ?? false,
            })),
            isLight: value.isLight,
          };
          return acc;
        },
        {} as WarperDataStructureItem
      );

      // 자료구조리스트에서 얕은 복사 문제가 생겨서 깊은 복사를 해준다
      const deepCloneStructures = _.cloneDeep(updatedAccDataStructures);

      accDataStructuresList.push(deepCloneStructures);

      const deepClodeCodeFlow = _.cloneDeep(accCodeFlow);
      accCodeFlowList.push(deepClodeCodeFlow);
      accConsoleLogList.push(accConsoleLog);
    }

    setCodeFlowList(accCodeFlowList);
    setStructuresList(accDataStructuresList);
    setConsole(accConsoleLogList);
    setCodeFlowLength(accCodeFlowList.length);
    setArrowTextList(arrowTexts);

    setHighlightLines(highlightLine);
  }, [preprocessedCodes]);

  return (
    <div id="split-2" ref={rightSectionRef}>
      <p className="view-section-title">시각화</p>
      <Arrow code={arrowTextList[stepIdx]} />
      <Split
        sizes={[70, 30]}
        minSize={100}
        expandToMin={false}
        gutterSize={10}
        gutterAlign="center"
        snapOffset={30}
        dragInterval={1}
        direction="horizontal"
        cursor="col-resize"
        style={{ display: "flex", flexDirection: "row", height: "85vh" }}
        className="split-container"
      >
        <div id="split-2-1" className="view-section2-1">
          <div className="view-data" style={{ height: "100%" }}>
            <p className="data-name">코드흐름</p>

            {codeFlowList?.length > 0 &&
              stepIdx >= 0 &&
              renderingCodeFlow(codeFlowList[stepIdx].objects[0].child, width, height)}
          </div>
        </div>
        <div id="split-2-2" className="view-section2-2" ref={rightSection2Ref}>
          <div className="view-data">
            <p className="data-name">변수</p>

            <ul className="var-list">
              {StructuresList?.length > 0 && stepIdx >= 0 && renderingStructure(StructuresList[stepIdx], width, height)}
            </ul>
          </div>
        </div>
      </Split>
    </div>
  );
};

export default RightSection;
