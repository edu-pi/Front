import { ActivateItem } from "@/pages/Visualization/types/activateItem";
import { AllObjectItem } from "@/pages/Visualization/types/codeFlow/allObjectItem";

// 하이라이트 효과를 줘야하는 부분을 표시해주는 함수
export const LightCodeFlow = (
  codeFlows: AllObjectItem[], //비주얼 스택
  Activate: ActivateItem[] //활성화 스택
): AllObjectItem[] => {
  return codeFlows.map((codeFlow) => {
    if (Activate.some((data) => data.id === codeFlow.id)) {
      // 수정해야하는 위치일때 isLight를 true로 바꾼다
      return {
        ...codeFlow,
        isLight: true,
        child: LightCodeFlow(codeFlow.child, Activate),
      };
    } else if (codeFlow.child && codeFlow.child.length > 0) {
      return {
        ...codeFlow,
        isLight: false,
        child: LightCodeFlow(codeFlow.child, Activate),
      };
    }
    return { ...codeFlow, isLight: false };
  });
};
