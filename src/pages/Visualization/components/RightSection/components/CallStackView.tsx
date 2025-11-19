import React from "react";
import { renderingStructure } from "../renderingStructure";
import { AllDataStructureItem } from "@/pages/Visualization/types/dataStructuresItem/allDataStructureItem";
import { WrapperDataStructureItem } from "@/pages/Visualization/types/dataStructuresItem/wrapperDataStructureItem";

interface CallStackViewProps {
  StructuresList: AllDataStructureItem;
  stepIdx: number;
  width: number;
  height: number;
  structuresScrollTop: number;
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
}

export const CallStackView = React.forwardRef<HTMLDivElement, CallStackViewProps>(
  ({ StructuresList, stepIdx, width, height, structuresScrollTop, onScroll }, ref) => {
    return (
      <div id="split-2-2" className="view-section2-2" ref={ref}>
        <div className="view-data" onScroll={onScroll}>
          <p className="data-name">콜스택</p>
          <ul className="var-list">
            {StructuresList?.length > 0 &&
              stepIdx >= 0 &&
              renderingStructure(
                StructuresList[stepIdx] as WrapperDataStructureItem,
                width,
                height,
                structuresScrollTop
              )}
          </ul>
        </div>
      </div>
    );
  }
);

CallStackView.displayName = "CallStackView";
