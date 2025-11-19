import { CodeFlowItem } from "../types";

export const deleteCodeFlow = (codeFlows: CodeFlowItem[], toDeleteId: number): CodeFlowItem[] => {
  return codeFlows
    .map((codeFlow) => {
      if (codeFlow.id === toDeleteId) {
        return null;
      }
      const newCodeFlow = { ...codeFlow };
      if (newCodeFlow.child && newCodeFlow.child.length > 0) {
        newCodeFlow.child = deleteCodeFlow([...newCodeFlow.child], toDeleteId);
      }
      return newCodeFlow;
    })
    .filter((codeFlow): codeFlow is CodeFlowItem => codeFlow !== null);
};
