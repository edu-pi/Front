export const insertEqualToDepth = (codeFlows: any[], toAddObject: any, prevTrackingId: number): any[] => {
  return codeFlows.flatMap((codeFlow) => {
    if (codeFlow.id === prevTrackingId) {
      return [codeFlow, toAddObject];
    } else if (codeFlow.child && codeFlow.child.length > 0) {
      return {
        ...codeFlow,
        child: insertEqualToDepth(codeFlow.child, toAddObject, prevTrackingId),
      };
    } else {
      return codeFlow;
    }
  });
};
