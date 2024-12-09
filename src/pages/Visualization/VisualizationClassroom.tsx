import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import styles from "./Visualization.module.css";
import "./gutter.css";
import { getUser } from "@/services/api";
import { useCookies } from "react-cookie";
import LeftSection from "./components/LeftSection/LeftSection";
import RightSection from "./components/RightSection/RightSection";
import GptIcon from "./components/LeftSection/components/GptIcon";
import GptComment from "./components/LeftSection/components/GptComment";
import Split from "react-split";
import { ValidTypeDto } from "@/pages/Visualization/types/dto/ValidTypeDto";
import { fetchGuestActionRequest, getGuestStatus, getClassAccessRightData } from "@/services/api";
import { CodeContext } from "./context/CodeContext";
import { PreprocessedCodesContext } from "./context/PreProcessedCodesContext";
import { InputErrorContext } from "./context/InputErrorContext";
//zustand store
import { useAccessRightStore } from "@/store/accessRight";
import { useEditorStore } from "@/store/editor";

import { useMswReadyStore } from "@/store/mswReady";
import { useGptTooltipStore } from "@/store/gptTooltip";
import Header from "../components/Header";
import { getUserProps } from "@/types/apiTypes";
enum ActionType {
  ING = 1,
  COMPLETE = 2,
  HELP = 3,
}
interface ClassAccessRightDataType {
  isAccess: boolean;
  isHost: boolean;
}
// 원본 코드 타입 정의

const VisualizationClassroom = () => {
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
  const navigate = useNavigate();
  const { data: userData } = useQuery<getUserProps>({
    queryKey: ["user"],
    queryFn: getUser,
    staleTime: 1000 * 60,
    retry: 3,
  });

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

  // zustand store
  const { focus } = useEditorStore();
  const isGptToggle = useGptTooltipStore((state) => state.isGptToggle);
  const gptPin = useGptTooltipStore((state) => state.gptPin);

  const setIsHost = useAccessRightStore((state) => state.setIsHost);
  const { isMswReady } = useMswReadyStore((state) => state);
  const params = useParams();
  const classroomId = Number(params.classroomId);

  const { data: classAccessRightData, isSuccess } = useQuery<ClassAccessRightDataType>({
    queryKey: ["classAccessRightData", classroomId],
    queryFn: () => getClassAccessRightData(classroomId),
    enabled: isMswReady,
    staleTime: 1000 * 60 * 60,
  });
  const { data: guestStatus, refetch } = useQuery({
    queryKey: ["vizclassroom", classroomId, userData?.result.email],
    queryFn: () => getGuestStatus(classroomId),
    enabled: isMswReady && !classAccessRightData?.isHost,
    staleTime: 1000 * 60 * 60,
  });
  useEffect(() => {
    if (isSuccess) {
      setIsHost(classAccessRightData.isHost);
      if (!classAccessRightData?.isAccess) {
        navigate("/");
      }
    }
  }, [classAccessRightData, isSuccess]);

  // guestStatus의 상태가 바뀔 때마다 actionType 업데이트

  const useGuestActionMutation = () => {
    return useMutation({
      mutationFn: fetchGuestActionRequest,
      onSuccess: () => {
        refetch();
      },
      onError: (error) => {
        console.error("Submit Error:", error);
      },
    });
  };
  const guestActionMutation = useGuestActionMutation();

  const handelIngRequest = () => {
    guestActionMutation.mutate({ classroomId: classroomId, action: 1, code: code });
  };
  const handleHelpRequest = () => {
    guestActionMutation.mutate({ classroomId: classroomId, action: 2, code: code });
  };
  const handleCompleteRequest = () => {
    guestActionMutation.mutate({ classroomId: classroomId, action: 3, code: code });
  };
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
              {isTutorialVisible && (
                <>
                  <div
                    className="tutorial-modal"
                    style={{
                      top: `${tutorialPosition.top}px`,
                      left: `${tutorialPosition.left}px`,
                    }}
                  >
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
              <div className="floating-buttons">
                {guestStatus?.result === ActionType.HELP && (
                  <button className="btn btn-complete-summit" onClick={handelIngRequest}>
                    <img
                      src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M18 6L6 18'%3E%3C/path%3E%3Cpath d='M6 6l12 12'%3E%3C/path%3E%3C/svg%3E"
                      alt="제출 완료 아이콘"
                    />
                    제출 완료
                  </button>
                )}
                {guestStatus?.result === ActionType.ING && (
                  <button className="btn btn-help" onClick={handleHelpRequest}>
                    <img
                      src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'%3E%3C/circle%3E%3Cpath d='M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3'%3E%3C/path%3E%3Cline x1='12' y1='17' x2='12.01' y2='17'%3E%3C/line%3E%3C/svg%3E"
                      alt="도움말 아이콘"
                    />
                    도움 요청
                  </button>
                )}
                {guestStatus?.result === ActionType.ING && (
                  <button className="btn btn-complete" onClick={handleCompleteRequest}>
                    <img
                      src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M22 11.08V12a10 10 0 1 1-5.93-9.14'%3E%3C/path%3E%3Cpolyline points='22 4 12 14.01 9 11.01'%3E%3C/polyline%3E%3C/svg%3E"
                      alt="완료 아이콘"
                    />
                    완료
                  </button>
                )}
                {guestStatus?.result === ActionType.COMPLETE && (
                  <button className="btn btn-cancel" onClick={handelIngRequest}>
                    <img
                      src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M18 6L6 18'%3E%3C/path%3E%3Cpath d='M6 6l12 12'%3E%3C/path%3E%3C/svg%3E"
                      alt="취소 아이콘"
                    />
                    취소
                  </button>
                )}
              </div>
            </main>
          </div>
        </InputErrorContext.Provider>
      </PreprocessedCodesContext.Provider>
    </CodeContext.Provider>
  );
};
export default VisualizationClassroom;
