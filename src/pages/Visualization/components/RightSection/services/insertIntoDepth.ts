export const insertIntoDepth = (codeFlows: any[], toAddObject: any, prevTrackingId: number): any[] => {
  return codeFlows.map((codeFlow) => {
    if (codeFlow.id === prevTrackingId) {
      return {
        ...codeFlow,
        child: [toAddObject, ...codeFlow.child],
      };
    } else if (codeFlow.child && codeFlow.child.length > 0) {
      return {
        ...codeFlow,
        child: insertIntoDepth(codeFlow.child, toAddObject, prevTrackingId),
      };
    } else {
      return codeFlow;
    }
  });
};
