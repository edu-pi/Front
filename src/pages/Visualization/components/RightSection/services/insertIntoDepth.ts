import { CodeFlowItem } from "../types";

export const insertIntoDepth = (
  codeFlows: CodeFlowItem[],
  toAddObject: CodeFlowItem,
  prevTrackingId: number
): CodeFlowItem[] => {
  return codeFlows.map((codeFlow) => {
    if (codeFlow.id === prevTrackingId) {
      return {
        ...codeFlow,
        child: [toAddObject, ...(codeFlow.child || [])],
      };
    }
    if (codeFlow.child && codeFlow.child.length > 0) {
      return {
        ...codeFlow,
        child: insertIntoDepth(codeFlow.child, toAddObject, prevTrackingId),
      };
    }
    return codeFlow;
  });
};
