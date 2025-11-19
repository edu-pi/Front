import { CodeFlowItem } from "../types";

export const addCodeFlow = (
  codeFlows: CodeFlowItem[],
  toAddObject: CodeFlowItem
): CodeFlowItem[] => {
  let updated = false;
  return codeFlows.reduce<CodeFlowItem[]>((acc, codeFlow) => {
    if (!updated && codeFlow.depth === toAddObject.depth - 1) {
      updated = true;
      acc.push({ ...codeFlow, child: [...(codeFlow.child || []), toAddObject] });
    } else if (codeFlow.child && codeFlow.child.length > 0) {
      acc.push({
        ...codeFlow,
        child: addCodeFlow(codeFlow.child, toAddObject),
      });
    } else {
      acc.push(codeFlow);
    }

    return acc;
  }, []);
};
