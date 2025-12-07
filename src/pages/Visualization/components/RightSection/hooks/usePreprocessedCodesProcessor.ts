import { useEffect, useState } from "react";
import { PreprocessedCodesContext } from "../../../context/PreProcessedCodesContext";
import { useContext } from "react";
import { ActivateItem } from "@/pages/Visualization/types/activateItem";
import { AllDataStructureItem } from "@/pages/Visualization/types/dataStructuresItem/allDataStructureItem";
import { WrapperDataStructureItem } from "@/pages/Visualization/types/dataStructuresItem/wrapperDataStructureItem";
import { usedNameObjectType } from "../../../types/dataStructuresItem/usedNameObjectType";
import { State } from "../types";
import { useConsoleStore, useCodeFlowLengthStore } from "@/store/console";
import { useEditorStore } from "@/store/editor";
import { useArrowStore } from "@/store/arrow";
import _ from "lodash";

// Processors
import { dispatchProcessor } from "./processors/processorDispatcher";
import { ProcessorContext } from "./processors/types";
import { resetDataStructuresLight, calculateToLightStructures, applyLightToStructures } from "./processors/utils";

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

      const context: ProcessorContext = {
        preprocessedCode,
        accCodeFlow: state.accCodeFlow,
        accDataStructures: state.accDataStructures,
        usedName: state.usedName,
        usedId: state.usedId,
        activate: state.activate,
        prevTrackingId: state.prevTrackingId,
        prevTrackingDepth: state.prevTrackingDepth,
      };

      const result = dispatchProcessor(codeType, context);

      if (result.accCodeFlow) state.accCodeFlow = result.accCodeFlow;
      if (result.accDataStructures) state.accDataStructures = result.accDataStructures;
      if (result.usedName) state.usedName = result.usedName;
      if (result.usedId) state.usedId = result.usedId;
      if (result.activate) state.activate = result.activate;
      if (result.consoleLog) state.accConsoleLog += result.consoleLog;
      if (result.newTrackingId !== undefined) state.prevTrackingId = result.newTrackingId;
      if (result.newTrackingDepth !== undefined) state.prevTrackingDepth = result.newTrackingDepth;

      state.arrowTexts.push(...result.arrowTexts);
      state.highlightLine.push(...result.highlightIds);

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
