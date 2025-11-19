import { CodeFlowItem } from "../types";

export const findTargetChild = (codeFlows: CodeFlowItem[], toAddObject: { id: number }): CodeFlowItem[] => {
  let targetChild: CodeFlowItem[] = [];

  for (const codeFlow of codeFlows) {
    if (codeFlow.id === toAddObject.id) {
      targetChild = codeFlow.child || [];
      break;
    }
    if (codeFlow.child && codeFlow.child.length > 0) {
      targetChild = findTargetChild(codeFlow.child, toAddObject);
      if (targetChild.length > 0) {
        break;
      }
    }
  }

  return targetChild;
};
