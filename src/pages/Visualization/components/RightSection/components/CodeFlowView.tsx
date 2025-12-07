import React from "react";
import CodeFlowRenderer from "../CodeFlowRenderer";
import { State } from "../types";
import { VisualizationProvider } from "@/pages/Visualization/context/VisualizationContext";

interface CodeFlowViewProps {
  codeFlowList: State[];
  stepIdx: number;
  width: number;
  height: number;
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
}

export const CodeFlowView: React.FC<CodeFlowViewProps> = ({ codeFlowList, stepIdx, width, height, onScroll }) => {
  return (
    <div id="split-2-1" className="view-section2-1">
      <div className="view-data" onScroll={onScroll}>
        <p className="data-name">코드흐름</p>
        <div style={{ width: "600px", display: "flex", flexDirection: "column", flex: 1 }}>
          <VisualizationProvider width={width} height={height}>
            {codeFlowList?.length > 0 && stepIdx >= 0 && (
              <CodeFlowRenderer codeFlows={codeFlowList[stepIdx].objects[0].child} />
            )}
          </VisualizationProvider>
        </div>
      </div>
    </div>
  );
};
