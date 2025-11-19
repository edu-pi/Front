import { useState, useEffect, useRef, useCallback } from "react";
import { useConsoleStore, useCodeFlowLengthStore } from "@/store/console";

export const useVisualizationPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedValue, setSelectedValue] = useState("1x");
  const intervalRef = useRef<number | null>(null);
  
  const codeFlowLength = useCodeFlowLengthStore((state) => state.codeFlowLength);
  const consoleIdx = useConsoleStore((state) => state.stepIdx);
  const incrementStepIdx = useConsoleStore((state) => state.incrementStepIdx);
  const decrementStepIdx = useConsoleStore((state) => state.decrementStepIdx);

  const onForward = useCallback(() => {
    if (consoleIdx < codeFlowLength - 1) {
      incrementStepIdx();
    }
  }, [consoleIdx, codeFlowLength, incrementStepIdx]);

  const onBack = useCallback(() => {
    if (consoleIdx > 0) {
      decrementStepIdx();
    }
  }, [consoleIdx, decrementStepIdx]);

  const onPlay = useCallback(() => {
    if (codeFlowLength === 0) return;
    setIsPlaying((prev) => !prev);
  }, [codeFlowLength]);

  const setPlaying = useCallback((value: boolean) => {
    setIsPlaying(value);
  }, []);

  // 속도에 따른 인터벌 설정
  useEffect(() => {
    if (isPlaying) {
      const getIntervalTime = () => {
        switch (selectedValue) {
          case "0.5x":
            return 2000;
          case "1x":
            return 1000;
          case "2x":
            return 500;
          case "3x":
            return 300;
          default:
            return 1000;
        }
      };

      intervalRef.current = setInterval(onForward, getIntervalTime());

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  }, [isPlaying, selectedValue, onForward]);

  const handleSpeedChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(event.target.value);
  };

  return {
    isPlaying,
    selectedValue,
    onPlay,
    onForward,
    onBack,
    handleSpeedChange,
    setIsPlaying: setPlaying,
  };
};

