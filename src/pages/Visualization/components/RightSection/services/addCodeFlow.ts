// 새로운 객체를 CodeFlow에 추가하는 함수
export const addCodeFlow = (
  codeFlows: any[], // 현제 코드흐름 시각화 정보를 담고 있는 리스트
  toAddObject: any
): any[] => {
  let updated = false;
  return codeFlows.reduceRight<any[]>((acc, codeFlow) => {
    // 아직 추가하지 않았고, depth가 targetDepth - 1인 경우
    if (!updated && codeFlow.depth === toAddObject.depth - 1) {
      updated = true;

      acc.unshift({ ...codeFlow, child: [...codeFlow.child, toAddObject] });
    }
    // 아직 child가 있고 노드가 끝나지 않은 경우
    else if (codeFlow.child && codeFlow.child.length > 0) {
      acc.unshift({
        ...codeFlow,
        child: addCodeFlow(codeFlow.child, toAddObject),
      });
    } else {
      acc.unshift(codeFlow);
    }

    return acc;
  }, []);
};
