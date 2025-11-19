import { CodeFlowItem } from "../types";

export const updateCodeFlow = (
  codeFlows: CodeFlowItem[],
  toAddObject: Partial<CodeFlowItem> & { id: number }
): CodeFlowItem[] => {
  return codeFlows.map((codeFlow) => {
    if (codeFlow.id === toAddObject.id) {
      if (toAddObject.type === "ifElseChange") {
        return {
          ...codeFlow,
          ...toAddObject,
          type: codeFlow.type,
          child: codeFlow.child || [],
        };
      }
      return { ...codeFlow, ...toAddObject, child: codeFlow.child || [] };
    }
    if (codeFlow.child && codeFlow.child.length > 0) {
      return {
        ...codeFlow,
        child: updateCodeFlow(codeFlow.child, toAddObject),
      };
    }

    return codeFlow;
  });
};
