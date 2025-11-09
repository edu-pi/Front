import { useEffect } from "react";
import ResizeObserver from "resize-observer-polyfill";
import { useRightSectionStore } from "@/store/arrow";

export const useResizeObserver = (ref: React.RefObject<HTMLDivElement>) => {
  const setWidth = useRightSectionStore((state) => state.setWidth);
  const setHeight = useRightSectionStore((state) => state.setHeight);

  useEffect(() => {
    if (!ref.current) return;

    const resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setWidth(width);
        setHeight(height);
      }
    });

    resizeObserver.observe(ref.current);

    return () => {
      if (ref.current) {
        resizeObserver.unobserve(ref.current);
      }
    };
  }, [ref, setWidth, setHeight]);
};
