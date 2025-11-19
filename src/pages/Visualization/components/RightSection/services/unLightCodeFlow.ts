import { CodeFlowItem } from "../types";

export const unLightCodeFlow = (accCodeFlow: CodeFlowItem[]): CodeFlowItem[] => {
  return accCodeFlow.map((codeFlow) => {
    if (codeFlow.child && codeFlow.child.length > 0) {
      return {
        ...codeFlow,
        isLight: false,
        child: unLightCodeFlow(codeFlow.child),
      };
    }
    return { ...codeFlow, isLight: false };
  });
};
