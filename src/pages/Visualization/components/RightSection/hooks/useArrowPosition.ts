import { useEffect, useCallback } from "react";
import { useArrowStore } from "@/store/arrow";

interface UseArrowPositionProps {
  stepIdx: number;
  codeFlowScrollTop: number;
  structuresScrollTop: number;
}

export const useArrowPosition = ({ stepIdx, codeFlowScrollTop, structuresScrollTop }: UseArrowPositionProps) => {
  const setTop = useArrowStore((state) => state.setTop);
  const setRight = useArrowStore((state) => state.setRight);

  const updatePosition = useCallback(() => {
    // Try to find the highlighted code flow item
    const codeFlowElement = document.getElementById("highlighted-code-flow");
    if (codeFlowElement) {
      const rect = codeFlowElement.getBoundingClientRect();

      setTop(rect.top);
      setRight(rect.right);
      return;
    }

    const structureElement = document.getElementById("highlighted-structure-item");
    if (structureElement) {
      const rect = structureElement.getBoundingClientRect();
      setTop(rect.top);
      setRight(rect.right);
      return;
    }
  }, [stepIdx, codeFlowScrollTop, structuresScrollTop, setTop, setRight]);

  useEffect(() => {
    updatePosition();
  }, [updatePosition]);
};
