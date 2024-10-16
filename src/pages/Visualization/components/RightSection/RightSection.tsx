import { useState, useContext, useEffect, useRef } from "react";
import { PreprocessedCodesContext } from "../../Visualization";
import Split from "react-split";
import _ from "lodash";
import ResizeObserver from "resize-observer-polyfill";
// components
import Arrow from "./components/Arrow/Arrow";

// 타입 정의
import { AllObjectItem } from "@/pages/Visualization/types/codeFlow/allObjectItem";
import { ActivateItem } from "@/pages/Visualization/types/activateItem";
import { VariablesDto } from "@/pages/Visualization/types/dto/variablesDto";
import { ForDto } from "@/pages/Visualization/types/dto/forDto";
import { PrintDto } from "@/pages/Visualization/types/dto/printDto";
import { IfElseDto } from "@/pages/Visualization/types/dto/ifElseDto";
import { CodeFlowVariableDto } from "@/pages/Visualization/types/dto/codeFlowVariableDto";
import { PrintItem } from "@/pages/Visualization/types/codeFlow/printItem";
import { VariableDto } from "@/pages/Visualization/types/dto/variableDto";
import { WhileDto } from "@/pages/Visualization/types/dto/whileDto";
import { AllDataStructureItem } from "@/pages/Visualization/types/dataStructuresItem/allDataStructureItem";
import { WarperDataStructureItem } from "@/pages/Visualization/types/dataStructuresItem/warperDataStructureItem";

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
  objects: AllObjectItem[];
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

  const highlightLine: number[] = [];
  // codeFlowList를 업데이트하는 useEffect
  useEffect(() => {
    let prevTrackingId: number = 0;
    let prevTrackingDepth: number = 0;
    let activate: ActivateItem[] = [];
    let usedId: number[] = [];
    const usedName: string[] = [];
    let accCodeFlow: State = {
      objects: [{ id: 0, type: "start", depth: 0, isLight: false, child: [] }],
    };
    let accDataStructures: WarperDataStructureItem = {
      main: [],
    };

    const accCodeFlowList: State[] = [];
    const accDataStructuresList: AllDataStructureItem = [];
    const accConsoleLogList: string[] = [];
    let accConsoleLog: string = "";
    const arrowTexts: string[] = [];
    for (let preprocessedCode of preprocessedCodes) {
      let changedCodeFlows: AllObjectItem[] = [];
      if (preprocessedCode.type.toLowerCase() === "whiledefine") {
        continue;
      }

      // 자료구조 시각화 부분이 들어왔을 때
      if (preprocessedCode.type.toLowerCase() === "assign".toLowerCase()) {
        const callStack = (preprocessedCode as VariablesDto).callStack;
        // 오른쪽에 변수로 함수를 넣을 때
        if ((preprocessedCode as VariablesDto).variables[0].type.toLowerCase() === "function".toLowerCase()) {
          const { id, expr, name, code, type } = (preprocessedCode as VariablesDto).variables[0];
          accDataStructures[callStack].push({ id, expr, name, code, type });
        } else {
          (preprocessedCode as VariablesDto).variables.forEach((variable: VariableDto) => {
            highlightLine.push(variable.id);
            // 자료구조 시각화에서 화살표에 넣을 코드를 넣는다
            arrowTexts.push(variable.code);

            // 이미 한번 자료구조 시각화에 표현된 name인 경우
            if (usedName.includes(variable.name!)) {
              const targetName = variable.name!;

              accDataStructures = updateDataStructure(targetName, accDataStructures, variable, callStack);
            }
            // 처음 시각화해주는 자료구조인 경우
            else {
              accDataStructures.callStack.push(variable);
              usedName.push(variable.name!);
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
      let toLightStructures: any;
      if ((preprocessedCode as VariablesDto).variables === undefined) {
        toLightStructures = [];
      } else {
        toLightStructures = (preprocessedCode as VariablesDto).variables?.map((element) => {
          return element.name;
        });
      }

      accDataStructures = Object.keys(accDataStructures).reduce((acc, key) => {
        acc[key] = accDataStructures[key].map((structure) => ({
          ...structure,
          isLight: toLightStructures?.includes(structure.name), // toLightStructures에 자료구조 이름이 있으면 isLight를 true로 설정
        }));
        return acc;
      }, {} as WarperDataStructureItem);

      // 자료구조리스트에서 얕은 복사 문제가 생겨서 깊은 복사를 해준다
      const deepCloneStructures = _.cloneDeep(accDataStructures);

      accDataStructuresList.push(deepCloneStructures);
      accCodeFlowList.push(accCodeFlow);
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
          <Arrow code={arrowTextList[stepIdx]} />
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
