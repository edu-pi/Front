import React from "react";
import styles from "../RightSection.module.css";

interface VisualizationControlsProps {
  onboardingStep: boolean[];
  codeVizMutation: {
    mutate: (variables: { code: string; inputData: string }) => void;
    isPending: boolean;
  };
  codeExecMutation: {
    mutate: (variables: { code: string; inputData: string }) => void;
    isPending: boolean;
  };
  code: string;
  inputData: string;
  isPlaying: boolean;
  onPlay: () => void;
  onForward: () => void;
  onBack: () => void;
  selectedValue: string;
  handleSpeedChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  consoleIdx: number;
  codeFlowLength: number;
  refs: {
    visualizeButtonRef: React.RefObject<HTMLDivElement>;
    ResultButtonRef: React.RefObject<HTMLDivElement>;
    visualizeController: React.RefObject<HTMLDivElement>;
    speedButton: React.RefObject<HTMLDivElement>;
  };
}

export const VisualizationControls: React.FC<VisualizationControlsProps> = ({
  onboardingStep,
  codeVizMutation,
  codeExecMutation,
  code,
  inputData,
  isPlaying,
  onPlay,
  onForward,
  onBack,
  selectedValue,
  handleSpeedChange,
  consoleIdx,
  codeFlowLength,
  refs,
}) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    codeVizMutation.mutate({ code, inputData });
  };

  const handleRunCode = () => {
    codeExecMutation.mutate({ code, inputData });
  };

  return (
    <div className={styles["top-bar"]}>
      <p className={styles["view-section-title"]}>시각화</p>
      <div className={styles["play-wrap"]}>
        <form onSubmit={handleSubmit}>
          <div
            ref={refs.visualizeButtonRef}
            className={`tutorial-button ${onboardingStep[1] ? "active" : ""}`}
            style={{ position: "relative" }}
          >
            <button
              type="submit"
              className={`${styles["view-btn"]} ${codeVizMutation.isPending ? styles["view-btn-loading"] : ""}`}
              disabled={codeVizMutation.isPending}
            >
              <img src="/image/icon_play_w.svg" alt="" />
              시각화
            </button>
          </div>
        </form>
        <div className="flex items-center gap-4">
          <div
            ref={refs.ResultButtonRef}
            className={`tutorial-button ${onboardingStep[2] ? "active" : ""}`}
            style={{ position: "relative" }}
          >
            <button
              type="button"
              className={`${styles["playcode-btn"]} ${
                codeExecMutation.isPending ? styles["playcode-btn-loading"] : ""
              }`}
              onClick={handleRunCode}
              disabled={codeExecMutation.isPending}
            >
              <img src="/image/icon_play_w.svg" alt="" />
              결과보기
            </button>
          </div>
        </div>
        <div>
          <div
            ref={refs.visualizeController}
            className={`controller tutorial-button ${onboardingStep[3] ? "active" : ""} `}
          >
            <button>
              <img src="/image/icon_play_back.svg" onClick={onBack} alt="뒤로" />
            </button>
            <button className="ml8">
              {isPlaying ? (
                <img src="/image/icon_play_stop.svg" onClick={onPlay} alt="일시정지" />
              ) : (
                <img src="/image/icon_play.svg" onClick={onPlay} alt="재생" />
              )}
            </button>
            <button className="ml8" onClick={onForward}>
              <img src="/image/icon_play_next.svg" alt="다음" />
            </button>
          </div>
          <p className="ml14 fz14">
            ({consoleIdx}/{codeFlowLength - 1 == -1 ? 0 : codeFlowLength - 1})
          </p>
          <div ref={refs.speedButton} className={`controller tutorial-button ${onboardingStep[4] ? "active" : ""} `}>
            <p className="ml24 fz14">Play Speed</p>
            <select name="" id="" className="s__select ml14" value={selectedValue} onChange={handleSpeedChange}>
              <option value="0.5x">0.5X</option>
              <option value="1x">1X</option>
              <option value="2x">2X</option>
              <option value="3x">3X</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

