export const unLightCodeFlow = (accCodeFlow: any) => {
  return accCodeFlow.map((codeFlow: any) => {
    if (codeFlow.child) {
      return {
        ...codeFlow,
        isLight: false,
        child: unLightCodeFlow(codeFlow.child),
      };
    }
    return { ...codeFlow, isLight: false };
  });
};
