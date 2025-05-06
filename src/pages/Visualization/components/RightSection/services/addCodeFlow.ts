export const addCodeFlow = (
  codeFlows: any[], // 현재 코드흐름 시각화 정보를 담고 있는 리스트
  toAddObject: any
): any[] => {
  let updated = false;
  return codeFlows.reduce<any[]>((acc, codeFlow) => {
    // 아직 추가하지 않았고, depth가 targetDepth - 1인 경우
    if (!updated && codeFlow.depth === toAddObject.depth - 1) {
      updated = true;
      acc.push({ ...codeFlow, child: [...codeFlow.child, toAddObject] });
    }
    // 아직 child가 있고 노드가 끝나지 않은 경우
    else if (codeFlow.child && codeFlow.child.length > 0) {
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
