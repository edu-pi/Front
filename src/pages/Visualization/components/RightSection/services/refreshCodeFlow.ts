import { CodeFlowItem } from "../types";

export const refreshCodeFlow = (
  codeFlows: CodeFlowItem[],
  toAddObject: Partial<CodeFlowItem> & { id: number }
): CodeFlowItem[] => {
  return codeFlows.map((codeFlow) => {
    if (codeFlow.id === toAddObject.id) {
      return {
        ...codeFlow,
        ...toAddObject,
        type: codeFlow.type,
        child: [],
      };
    }
    if (codeFlow.child && codeFlow.child.length > 0) {
      return {
        ...codeFlow,
        child: refreshCodeFlow(codeFlow.child, toAddObject),
      };
    }

    return codeFlow;
  });
};
