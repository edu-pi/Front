import { CodeFlowItem } from "../types";

export const turnOffAllNodeLight = (codeFlows: CodeFlowItem[]): CodeFlowItem[] => {
  return codeFlows.map((codeFlow) => {
    return {
      ...codeFlow,
      isLight: false,
      child: turnOffAllNodeLight(codeFlow.child || []),
    };
  });
};
