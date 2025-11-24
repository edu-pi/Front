import { useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { CodeContext } from "../../context/CodeContext";
import { useCustomAlert } from "@/pages/components/CustomAlert";
import Split from "react-split";
import Arrow from "./components/Arrow/Arrow";
import { RightSectionProps } from "./types";

// 커스텀 훅
import { useCodeVisualizationMutation } from "./hooks/useCodeVisualizationMutation";
import { useCodeExecutionMutation } from "./hooks/useCodeExecutionMutation";
import { useVisualizationPlayer } from "./hooks/useVisualizationPlayer";
import { usePreprocessedCodesProcessor } from "./hooks/usePreprocessedCodesProcessor";
import { useResizeObserver } from "./hooks/useResizeObserver";
import { useTutorialPosition } from "./hooks/useTutorialPosition";
import { useScrollHandlers } from "./hooks/useScrollHandlers";
import { useArrowPosition } from "./hooks/useArrowPosition";

// 컴포넌트
import { VisualizationControls } from "./components/VisualizationControls";
import { CodeFlowView } from "./components/CodeFlowView";
import { CallStackView } from "./components/CallStackView";

// Zustand store
import { useConsoleStore, useCodeFlowLengthStore } from "@/store/console";
import { useRightSectionStore } from "@/store/arrow";
import { useContext } from "react";

const RightSection = ({ onboardingStep, setTutorialPosition }: RightSectionProps) => {
  const { CustomAlert } = useCustomAlert();
  const location = useLocation();

  // Context
  const codeContext = useContext(CodeContext);
  if (!codeContext) {
    throw new Error("CodeContext not found");
  }
  const { code } = codeContext;

  // Zustand stores
  const { inputData } = useConsoleStore();
  const stepIdx = useConsoleStore((state) => state.stepIdx);
  const setStepIdx = useConsoleStore((state) => state.setStepIdx);
  const codeFlowLength = useCodeFlowLengthStore((state) => state.codeFlowLength);
  const consoleIdx = useConsoleStore((state) => state.stepIdx);
  const width = useRightSectionStore((state) => state.width);
  const height = useRightSectionStore((state) => state.height);

  // Refs
  const rightSectionRef = useRef<HTMLDivElement | null>(null);
  const rightSection2Ref = useRef<HTMLDivElement | null>(null);
  const visualizeButtonRef = useRef<HTMLDivElement | null>(null);
  const ResultButtonRef = useRef<HTMLDivElement | null>(null);
  const visualizeController = useRef<HTMLDivElement | null>(null);
  const speedButton = useRef<HTMLDivElement | null>(null);

  // 커스텀 훅 - Visualization Player
  const { isPlaying, selectedValue, onPlay, onForward, onBack, handleSpeedChange, setIsPlaying } =
    useVisualizationPlayer();
  const codeVizMutation = useCodeVisualizationMutation({ setIsPlaying });
  const codeExecMutation = useCodeExecutionMutation();
  const { codeFlowList, StructuresList, arrowTextList } = usePreprocessedCodesProcessor();
  const { codeFlowScrollTop, structuresScrollTop, handleScrollCodeFlow, handleScrollStructures } = useScrollHandlers();
  useResizeObserver(rightSectionRef);
  useResizeObserver(rightSection2Ref);
  useTutorialPosition({
    onboardingStep,
    setTutorialPosition,
    refs: {
      visualizeButtonRef,
      ResultButtonRef,
      visualizeController,
      speedButton,
    },
  });

  useArrowPosition({
    stepIdx,
    codeFlowScrollTop,
    structuresScrollTop,
  });

  // Location 변경 시 stepIdx 초기화
  useEffect(() => {
    return () => {
      setStepIdx(0);
    };
  }, [setStepIdx, location]);

  return (
    <>
      <CustomAlert />
      <div id="split-2" ref={rightSectionRef} style={{ display: "flex", flexDirection: "column", flex: "1" }}>
        <VisualizationControls
          onboardingStep={onboardingStep}
          codeVizMutation={codeVizMutation}
          codeExecMutation={codeExecMutation}
          code={code}
          inputData={inputData}
          isPlaying={isPlaying}
          onPlay={onPlay}
          onForward={onForward}
          onBack={onBack}
          selectedValue={selectedValue}
          handleSpeedChange={handleSpeedChange}
          consoleIdx={consoleIdx}
          codeFlowLength={codeFlowLength}
          refs={{
            visualizeButtonRef,
            ResultButtonRef,
            visualizeController,
            speedButton,
          }}
        />
        <Arrow code={arrowTextList[stepIdx]} />
        <Split
          sizes={[50, 50]}
          minSize={100}
          expandToMin={false}
          gutterSize={10}
          gutterAlign="center"
          snapOffset={30}
          dragInterval={1}
          direction="horizontal"
          cursor="col-resize"
          style={{ display: "flex", flexDirection: "row", height: "100%", flex: 1, overflow: "hidden" }}
          className="split-container"
        >
          <CodeFlowView
            codeFlowList={codeFlowList}
            stepIdx={stepIdx}
            width={width}
            height={height}
            onScroll={handleScrollCodeFlow}
          />
          <CallStackView
            StructuresList={StructuresList}
            stepIdx={stepIdx}
            onScroll={handleScrollStructures}
            ref={rightSection2Ref}
          />
        </Split>
      </div>
    </>
  );
};

export default RightSection;
