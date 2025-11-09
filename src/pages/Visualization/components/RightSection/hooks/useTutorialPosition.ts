import { useEffect, RefObject } from "react";

interface UseTutorialPositionProps {
  onboardingStep: boolean[];
  setTutorialPosition: React.Dispatch<React.SetStateAction<{ top: number; left: number }>>;
  refs: {
    visualizeButtonRef: RefObject<HTMLDivElement>;
    ResultButtonRef: RefObject<HTMLDivElement>;
    visualizeController: RefObject<HTMLDivElement>;
    speedButton: RefObject<HTMLDivElement>;
  };
}

export const useTutorialPosition = ({
  onboardingStep,
  setTutorialPosition,
  refs,
}: UseTutorialPositionProps) => {
  const calculatePosition = () => {
    if (refs.visualizeButtonRef.current && onboardingStep[1]) {
      const rect = refs.visualizeButtonRef.current.getBoundingClientRect();
      setTutorialPosition({
        top: rect.top + 50,
        left: rect.left - 400,
      });
    }
    if (refs.ResultButtonRef.current && onboardingStep[2]) {
      const rect = refs.ResultButtonRef.current.getBoundingClientRect();
      setTutorialPosition({
        top: rect.top + 50,
        left: rect.left - 400,
      });
    }
    if (refs.visualizeController.current && onboardingStep[3]) {
      const rect = refs.visualizeController.current.getBoundingClientRect();
      setTutorialPosition({
        top: rect.top + 50,
        left: rect.left - 385,
      });
    }
    if (refs.speedButton.current && onboardingStep[4]) {
      const rect = refs.speedButton.current.getBoundingClientRect();
      setTutorialPosition({
        top: rect.top + 50,
        left: rect.left - 290,
      });
    }
  };

  useEffect(() => {
    // 초기 위치 설정
    calculatePosition();

    // 브라우저 크기 변경 이벤트 처리
    const handleResize = () => {
      calculatePosition();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [onboardingStep, setTutorialPosition]);
};

