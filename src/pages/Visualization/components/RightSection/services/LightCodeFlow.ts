import { CodeFlowItem } from "../types";
import { ActivateItem } from "@/pages/Visualization/types/activateItem";

export const LightCodeFlow = (
  codeFlows: CodeFlowItem[],
  Activate: ActivateItem[]
): CodeFlowItem[] => {
  return codeFlows.map((codeFlow) => {
    if (Activate.some((data) => data.id === codeFlow.id)) {
      return {
        ...codeFlow,
        isLight: true,
        child: LightCodeFlow(codeFlow.child || [], Activate),
      };
    }
    if (codeFlow.child && codeFlow.child.length > 0) {
      return {
        ...codeFlow,
        isLight: false,
        child: LightCodeFlow(codeFlow.child, Activate),
      };
    }
    return { ...codeFlow, isLight: false };
  });
};
