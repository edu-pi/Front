import { CodeFlowItem } from "../types";

export const insertEqualToDepth = (
  codeFlows: CodeFlowItem[],
  toAddObject: CodeFlowItem,
  prevTrackingId: number
): CodeFlowItem[] => {
  return codeFlows.flatMap((codeFlow) => {
    if (codeFlow.id === prevTrackingId) {
      return [codeFlow, toAddObject];
    }
    if (codeFlow.child && codeFlow.child.length > 0) {
      return {
        ...codeFlow,
        child: insertEqualToDepth(codeFlow.child, toAddObject, prevTrackingId),
      };
    }
    return codeFlow;
  });
};
