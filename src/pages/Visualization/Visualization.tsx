import { useEffect, useState } from "react";
import styles from "./Visualization.module.css";
import "./gutter.css";
import { useCookies } from "react-cookie";
import Header from "../components/Header";
import LeftSection from "./components/LeftSection/LeftSection";
import RightSection from "./components/RightSection/RightSection";
import GptComment from "./components/LeftSection/components/GptComment";
import GptIcon from "./components/LeftSection/components/GptIcon";

import Split from "react-split";
import { ValidTypeDto } from "@/pages/Visualization/types/dto/ValidTypeDto";
import { CodeContext } from "./context/CodeContext";
import { PreprocessedCodesContext } from "./context/PreProcessedCodesContext";
import { InputErrorContext } from "./context/InputErrorContext";
import { useConsoleStore } from "@/store/console";

//zustand store
import { useEditorStore } from "@/store/editor";
import { useGptTooltipStore } from "@/store/gptTooltip";

export default function Visualization() {
  const [code, setCode] = useState<any>(
    [
      "for i in range(2, 10):\n" +
        "   for j in range(1, 10):\n" +
        '      print(f"{i} x {j} = {i * j}")\n' +
        "   print()\n",
    ].join("\n")
  );
  const [preprocessedCodes, setPreprocessedCodes] = useState<ValidTypeDto[]>([]);
  const [isInputError, setIsInputError] = useState(false);

  const [cookies, setCookie] = useCookies(["firstVisit"]);

  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingStep, setOnboardingStep] = useState([true, false, false, false, false, false, false]);
  const [isTutorialVisible, setIsTutorialVisible] = useState(false);

  const [tutorialPosition, setTutorialPosition] = useState({ top: 0, left: 0 });
  const steps = [
    {
      title: "코드 에디터",
      description: "파이썬 코드를 입력할 수 있는 에디터입니다.",
    },
    {
      title: "시각화 버튼",
      description: "시각화를 할 수 있는 버튼.",
    },
    {
      title: "결과보기 버튼",
      description: "코드의 결과를 볼 수 있는 버튼.",
    },
    {
      title: "시각화 조작 버튼",
      description: "시각화를 조작할 수 있는 버튼.",
    },
    {
      title: "시각화 배속 버튼",
      description: "시각화를 배속 할 수 있는 버튼.",
    },
    {
      title: "커리큘럼 버튼",
      description: "예시코드를 이용할 수 있는 기능.",
    },
    {
      title: "input 입력창과 콘솔",
      description: "input을 입력할 수 있는 창과 코드의 결과가 나오는 콘솔 창.",
    },
  ];
  useEffect(() => {
    // 첫 방문 확인 로직
    if (!cookies.firstVisit) {
      setIsTutorialVisible(true);
    }
  }, [cookies, setCookie]);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      let newOnboardingStep = [false, false, false, false, false, false, false];
      newOnboardingStep[currentStep + 1] = true;
      setCurrentStep((prev) => prev + 1);
      setOnboardingStep(newOnboardingStep);
    } else {
      // 마지막 단계에서 완료 버튼 클릭 시 튜토리얼 숨기기
      setCookie("firstVisit", "true", {
        path: "/",
        maxAge: 7 * 24 * 60 * 60, // 7일(초 단위)
      });
      setIsTutorialVisible(false);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      let newOnboardingStep = [false, false, false, false, false, false, false];
      newOnboardingStep[currentStep - 1] = true;
      setCurrentStep((prev) => prev - 1);
      setOnboardingStep(newOnboardingStep);
    }
  };

  const closeTutorial = () => {
    setCookie("firstVisit", "true", {
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7일(초 단위)
    });
    setIsTutorialVisible(false);
  };
  // zustand store
  const { resetInputData } = useConsoleStore();
  useEffect(() => {
    return () => {
      resetInputData();
    };
  }, [resetInputData]);

  // zustand store
  const { focus } = useEditorStore();
  const isGptToggle = useGptTooltipStore((state) => state.isGptToggle);
  const gptPin = useGptTooltipStore((state) => state.gptPin);

  return (
    <CodeContext.Provider value={{ code, setCode }}>
      <PreprocessedCodesContext.Provider value={{ preprocessedCodes, setPreprocessedCodes }}>
        <InputErrorContext.Provider value={{ isInputError, setIsInputError }}>
          <div style={{ overflow: "hidden", height: "100%" }}>
            <Header />
            <main className={styles.main}>
              {focus && gptPin ? <GptIcon /> : (gptPin || isGptToggle) && <GptComment />}

              <Split
                sizes={[30, 70]}
                minSize={100}
                expandToMin={false}
                gutterSize={10}
                gutterAlign="center"
                snapOffset={30}
                dragInterval={1}
                direction="horizontal"
                cursor="col-resize"
                style={{ display: "flex", width: "100%", height: "100%" }}
              >
                <LeftSection onboardingStep={onboardingStep} setTutorialPosition={setTutorialPosition} />
                <RightSection onboardingStep={onboardingStep} setTutorialPosition={setTutorialPosition} />
              </Split>
              <div className="floating-buttons">
                <div className="btn btn-manual">
                  <img
                    src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 4h18v16H3z'%3E%3C/path%3E%3Cpath d='M8 4v16M16 4v16'%3E%3C/path%3E%3C/svg%3E"
                    alt="완료 아이콘"
                  />
                  사용법
                </div>
              </div>
              {isTutorialVisible && (
                <>
                  <div
                    className="tutorial-modal"
                    style={{
                      top: `${tutorialPosition.top}px`,
                      left: `${tutorialPosition.left}px`,
                    }}
                  >
                    <button className="tutorial-close-button" onClick={closeTutorial}>
                      ×
                    </button>
                    <div className="tutorial-content">
                      <h2>{steps[currentStep].title}</h2>
                      <p>{steps[currentStep].description}</p>
                    </div>

                    <div className="tutorial-navigation">
                      {currentStep > 0 ? (
                        <button onClick={prevStep} className="nav-button prev">
                          이전
                        </button>
                      ) : (
                        <div></div>
                      )}
                      <button onClick={nextStep} className="nav-button next">
                        {currentStep < steps.length - 1 ? "다음" : "완료"}
                      </button>
                    </div>

                    <div className="step-indicators">
                      {steps.map((_, index) => (
                        <div key={index} className={`step-indicator ${currentStep === index ? "active" : ""}`} />
                      ))}
                    </div>
                  </div>
                  <div className="tutorial-overlay"></div>
                </>
              )}
            </main>
          </div>
        </InputErrorContext.Provider>
      </PreprocessedCodesContext.Provider>
    </CodeContext.Provider>
  );
}
