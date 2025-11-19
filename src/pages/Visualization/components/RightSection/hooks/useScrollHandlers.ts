import { useState, useCallback } from "react";

export const useScrollHandlers = () => {
  const [codeFlowScrollTop, setCodeFlowScrollTop] = useState<number>(0);
  const [structuresScrollTop, setStructuresScrollTop] = useState<number>(0);

  const handleScrollCodeFlow = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const element = e.target as HTMLDivElement;
    const scrollTop = element.scrollTop;
    setCodeFlowScrollTop(scrollTop);
  }, []);

  const handleScrollStructures = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const element = e.target as HTMLDivElement;
    const scrollTop = element.scrollTop;
    setStructuresScrollTop(scrollTop);
  }, []);

  return {
    codeFlowScrollTop,
    structuresScrollTop,
    handleScrollCodeFlow,
    handleScrollStructures,
  };
};

