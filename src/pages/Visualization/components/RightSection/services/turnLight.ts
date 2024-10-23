// 하이라이트 효과를 줘야하는 부분을 표시해주는 함수
export const turnLight = (
  codeFlows: any[], //비주얼 스택
  Activate: any[] //활성화 스택
): any[] => {
  return codeFlows.map((codeFlow) => {
    if (Activate.some((data) => data.id === codeFlow.id)) {
      // 수정해야하는 위치일때 isLight를 true로 바꾼다
      return {
        ...codeFlow,
        isLight: true,
        child: turnLight(codeFlow.child, Activate),
      };
    } else if (codeFlow.child && codeFlow.child.length > 0) {
      return {
        ...codeFlow,
        isLight: false,
        child: turnLight(codeFlow.child, Activate),
      };
    } else {
      return { ...codeFlow, isLight: false };
    }
  });
};
