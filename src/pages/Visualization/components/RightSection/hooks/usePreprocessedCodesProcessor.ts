import { useEffect, useState } from "react";
import { PreprocessedCodesContext } from "../../../context/PreProcessedCodesContext";
import { useContext } from "react";
import { ActivateItem } from "@/pages/Visualization/types/activateItem";
import { VariablesDto } from "@/pages/Visualization/types/dto/variablesDto";
import { ForDto } from "@/pages/Visualization/types/dto/forDto";
import { PrintDto } from "@/pages/Visualization/types/dto/printDto";
import { IfElseDto } from "@/pages/Visualization/types/dto/ifElseDto";
import { CodeFlowVariableDto } from "@/pages/Visualization/types/dto/codeFlowVariableDto";
import { WhileDto } from "@/pages/Visualization/types/dto/whileDto";
import { AllDataStructureItem } from "@/pages/Visualization/types/dataStructuresItem/allDataStructureItem";
import { WrapperDataStructureItem } from "@/pages/Visualization/types/dataStructuresItem/wrapperDataStructureItem";
import { CreateCallStackDto } from "@/pages/Visualization/types/dto/createCallStackDto";
import { EndUserFuncDto } from "@/pages/Visualization/types/dto/endUserFuncDto";
import { usedNameObjectType } from "../../../types/dataStructuresItem/usedNameObjectType";
import { AppendDto } from "../../../types/dto/appendDto";
import { IfElseChangeDto } from "@/pages/Visualization/types/dto/ifElseChangeDto";
import { State } from "../types";
import { useConsoleStore, useCodeFlowLengthStore } from "@/store/console";
import { useEditorStore } from "@/store/editor";
import { useArrowStore } from "@/store/arrow";
import _ from "lodash";

// Processors
import { processEndUserFunc } from "./processors/processEndUserFunc";
import { processAppend } from "./processors/processAppend";
import { processAssign } from "./processors/processAssign";
import { processCreateCallStack } from "./processors/processCreateCallStack";
import { processIfElseDefine } from "./processors/processIfElseDefine";
import { processCodeFlow } from "./processors/processCodeFlow";
import {
  resetDataStructuresLight,
  calculateToLightStructures,
  applyLightToStructures,
} from "./processors/utils";

interface ProcessingState {
  prevTrackingId: number;
  prevTrackingDepth: number;
  activate: ActivateItem[];
  usedId: number[];
  usedName: usedNameObjectType;
  accCodeFlow: State;
  accDataStructures: WrapperDataStructureItem;
  accCodeFlowList: State[];
  accDataStructuresList: AllDataStructureItem;
  accConsoleLogList: string[];
  accConsoleLog: string;
  arrowTexts: string[];
  highlightLine: number[];
}

const createInitialState = (): ProcessingState => ({
  prevTrackingId: 0,
  prevTrackingDepth: 0,
  activate: [],
  usedId: [],
  usedName: { main: [] },
  accCodeFlow: {
    objects: [{ id: 0, type: "start", depth: 0, isLight: false, child: [] }],
  },
  accDataStructures: {
    main: { data: [], isLight: false },
  },
  accCodeFlowList: [],
  accDataStructuresList: [],
  accConsoleLogList: [],
  accConsoleLog: "",
  arrowTexts: [],
  highlightLine: [],
});

export const usePreprocessedCodesProcessor = () => {
  const [codeFlowList, setCodeFlowList] = useState<State[]>([
    {
      objects: [{ id: 0, type: "start", depth: 0, isLight: false, child: [] }],
    },
  ]);
  const [StructuresList, setStructuresList] = useState<AllDataStructureItem>([]);
  const [arrowTextList, setArrowTextList] = useState<string[]>([]);

  const preprocessedCodesContext = useContext(PreprocessedCodesContext);
  const setConsoleList = useConsoleStore((state) => state.setConsoleList);
  const setCodeFlowLength = useCodeFlowLengthStore((state) => state.setCodeFlowLength);
  const setHighlightLines = useEditorStore((state) => state.setHighlightLines);
  const setDisplayNone = useArrowStore((state) => state.setDisplayNone);

  if (!preprocessedCodesContext) {
    throw new Error("preprocessedCodesContext not found");
  }

  const { preprocessedCodes } = preprocessedCodesContext;

  useEffect(() => {
    if (preprocessedCodes.length === 0) {
      setCodeFlowList([]);
      setStructuresList([]);
      setCodeFlowLength(0);
      setArrowTextList([]);
      setDisplayNone(true);
      return;
    }

    const state = createInitialState();

    for (const preprocessedCode of preprocessedCodes) {
      if (preprocessedCode.type.toLowerCase() === "whiledefine") {
        continue;
      }

      // 자료구조의 isLight 초기화
      state.accDataStructures = resetDataStructuresLight(state.accDataStructures);

      const codeType = preprocessedCode.type.toLowerCase();

      // 타입별 처리
      if (codeType === "enduserfunc") {
        const result = processEndUserFunc({
          preprocessedCode: preprocessedCode as EndUserFuncDto,
          accCodeFlow: state.accCodeFlow,
          accDataStructures: state.accDataStructures,
          usedName: state.usedName,
          prevTrackingId: state.prevTrackingId,
          prevTrackingDepth: state.prevTrackingDepth,
        });

        state.accCodeFlow = result.accCodeFlow;
        state.accDataStructures = result.accDataStructures;
        state.usedName = result.usedName;
        state.arrowTexts.push(result.arrowText);
        state.highlightLine.push(result.highlightId);
        state.prevTrackingId = result.newTrackingId;
        state.prevTrackingDepth = result.newTrackingDepth;
      } else if (codeType === "append") {
        const result = processAppend({
          preprocessedCode: preprocessedCode as AppendDto,
          accCodeFlow: state.accCodeFlow,
          accDataStructures: state.accDataStructures,
          usedId: state.usedId,
        });

        state.accCodeFlow = result.accCodeFlow;
        state.accDataStructures = result.accDataStructures;
        state.usedId = result.usedId;
        state.arrowTexts.push(result.arrowText);
        state.highlightLine.push(result.highlightId);
      } else if (codeType === "assign") {
        const result = processAssign({
          preprocessedCode: preprocessedCode as VariablesDto,
          accCodeFlow: state.accCodeFlow,
          accDataStructures: state.accDataStructures,
          usedName: state.usedName,
          usedId: state.usedId,
        });

        state.accCodeFlow = result.accCodeFlow;
        state.accDataStructures = result.accDataStructures;
        state.usedName = result.usedName;
        state.usedId = result.usedId;
        state.arrowTexts.push(...result.arrowTexts);
        state.highlightLine.push(...result.highlightIds);
      } else if (codeType === "createcallstack") {
        const result = processCreateCallStack({
          preprocessedCode: preprocessedCode as CreateCallStackDto,
          accDataStructures: state.accDataStructures,
          usedName: state.usedName,
        });

        state.accDataStructures = result.accDataStructures;
        state.usedName = result.usedName;
        state.arrowTexts.push(result.arrowText);
        state.highlightLine.push(result.highlightId);
      } else if (codeType === "ifelsedefine") {
        const result = processIfElseDefine({
          preprocessedCode: preprocessedCode as IfElseDto,
          accCodeFlow: state.accCodeFlow,
          usedId: state.usedId,
          prevTrackingId: state.prevTrackingId,
          prevTrackingDepth: state.prevTrackingDepth,
        });

        state.accCodeFlow = result.accCodeFlow;
        state.usedId = result.usedId;
        state.arrowTexts.push(result.arrowText);
        state.highlightLine.push(result.highlightId);
        state.prevTrackingId = result.newTrackingId;
        state.prevTrackingDepth = result.newTrackingDepth;
      } else {
        // 기타 타입 (for, print, while, variable 등)
        const result = processCodeFlow({
          preprocessedCode: preprocessedCode as ForDto | PrintDto | IfElseChangeDto | CodeFlowVariableDto | WhileDto,
          accCodeFlow: state.accCodeFlow,
          usedId: state.usedId,
          activate: state.activate,
          prevTrackingId: state.prevTrackingId,
          prevTrackingDepth: state.prevTrackingDepth,
        });

        state.accCodeFlow = result.accCodeFlow;
        state.usedId = result.usedId;
        state.activate = result.activate;
        state.arrowTexts.push(result.arrowText);
        state.highlightLine.push(result.highlightId);
        state.accConsoleLog += result.consoleLog;
        state.prevTrackingId = result.newTrackingId;
        state.prevTrackingDepth = result.newTrackingDepth;
      }

      // toLightStructures 계산 및 적용
      const { toLightStructures, accCodeFlow: updatedCodeFlow } = calculateToLightStructures(
        preprocessedCode,
        state.accCodeFlow
      );
      state.accCodeFlow = updatedCodeFlow;

      const updatedAccDataStructures = applyLightToStructures(state.accDataStructures, toLightStructures);

      // 깊은 복사 후 리스트에 추가
      const deepCloneStructures = _.cloneDeep(updatedAccDataStructures);
      state.accDataStructuresList.push(deepCloneStructures);

      const deepCloneCodeFlow = _.cloneDeep(state.accCodeFlow);
      state.accCodeFlowList.push(deepCloneCodeFlow);
      state.accConsoleLogList.push(state.accConsoleLog);
    }

    // 최종 상태 업데이트
    setCodeFlowList(state.accCodeFlowList);
    setStructuresList(state.accDataStructuresList);
    setConsoleList(state.accConsoleLogList);
    setCodeFlowLength(state.accCodeFlowList.length);
    setArrowTextList(state.arrowTexts);
    setHighlightLines(state.highlightLine);
  }, [preprocessedCodes, setCodeFlowLength, setConsoleList, setDisplayNone, setHighlightLines]);

  return {
    codeFlowList,
    StructuresList,
    arrowTextList,
  };
};
