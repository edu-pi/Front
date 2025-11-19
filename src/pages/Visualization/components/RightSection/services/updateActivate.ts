import { ActivateItem } from "@/pages/Visualization/types/activateItem";
import { CodeFlowItem } from "../types";

export const updateActivate = (
  oldActivates: ActivateItem[],
  newActivate: CodeFlowItem
): ActivateItem[] => {
  const tmpActivate: ActivateItem[] = [];

  for (const oldActivate of oldActivates) {
    if (oldActivate.depth === newActivate.depth) {
      tmpActivate.push({
        id: newActivate.id,
        depth: newActivate.depth,
        type: newActivate.type,
      });

      return tmpActivate;
    }
  }

  tmpActivate.push({
    id: newActivate.id,
    depth: newActivate.depth,
    type: newActivate.type,
  });

  return tmpActivate;
};
