import { createContext, useState, Dispatch, SetStateAction, useCallback, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import styles from "./Visualization.module.css";
import "./gutter.css";

import LoggedInClassroomHeader from "../components/LoggedInClassroomHeader";
import LeftSection from "./components/LeftSection/LeftSection";
import RightSection from "./components/RightSection/RightSection";

import Split from "react-split";
import { ValidTypeDto, isValidTypeDtoArray } from "@/pages/Visualization/types/dto/ValidTypeDto";

//zustand store
import { useConsoleStore, useCodeFlowLengthStore } from "@/store/console";
import { useEditorStore } from "@/store/editor";
import { useArrowStore } from "@/store/arrow";
import { useUserStore } from "@/store/user";
// 원본 코드 타입 정의
interface CodeContextType {
  code: string;
  setCode: Dispatch<SetStateAction<string>>;
}
// 전처리한 코드 타입 정의
interface PreprocessedCodeContextType {
  preprocessedCodes: ValidTypeDto[];
  setPreprocessedCodes: Dispatch<SetStateAction<ValidTypeDto[]>>;
}
// Create contexts
export const CodeContext = createContext<CodeContextType>({
  code: "",
  setCode: () => {},
});

export const PreprocessedCodesContext = createContext<PreprocessedCodeContextType>({
  preprocessedCodes: [],
  setPreprocessedCodes: () => {},
});

const VisualizationClassroom = () => {
  const [code, setCode] = useState<any>(
    ["a = 3", "for i in range(a):", "   print(' ' * ((a - 1) - i), end = '')", "   print('*' * (2 * i + 1))"].join("\n")
  );
  const [preprocessedCodes, setPreprocessedCodes] = useState<ValidTypeDto[]>([]);
  // zustand store
  const consoleIdx = useConsoleStore((state) => state.stepIdx);
  const resetConsole = useConsoleStore((state) => state.resetConsole);
  const incrementStepIdx = useConsoleStore((state) => state.incrementStepIdx);
  const decrementStepIdx = useConsoleStore((state) => state.decrementStepIdx);
  const codeFlowLength = useCodeFlowLengthStore((state) => state.codeFlowLength);
  const setDisplayNone = useArrowStore((state) => state.setDisplayNone);

  const setErrorLine = useEditorStore((state) => state.setErrorLine);

  const [isPlaying, setIsPlaying] = useState(false);

  const params = useParams();
  const classroomId = Number(params.classroomId);
  const mutation = useMutation({
    mutationFn: async (code: string) => {
      return fetch("http://localhost:8080/edupi-visualize/v1/python", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ source_code: code }),
      });
    },
    async onSuccess(data) {
      const jsonData = await data.json();
      // 타입 체크 함수
      if (isValidTypeDtoArray(jsonData)) {
        setPreprocessedCodes(jsonData);
        setDisplayNone(false);
      } else {
        throw new Error("데이터 형식이 올바르지 않습니다");
      }
    },
    onError(error) {
      console.error("Submit Error:", error);
      if (error.message === "데이터 형식이 올바르지 않습니다") {
        alert("데이터의 형식이 올바르지 않습니다.");
      } else {
        setErrorLine({ lineNumber: 1, message: "syntax error" });
        alert("코드 처리 중 에러가 발생했습니다.");
      }
    },
  });
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetConsole();
    mutation.mutate(code);
    setIsPlaying(() => true);
  };

  const onPlay = () => {
    if (codeFlowLength === 0) return;
    setIsPlaying((prev) => !prev);
  };

  const onForward = useCallback(() => {
    if (consoleIdx < codeFlowLength - 1) {
      incrementStepIdx();
    }
  }, [consoleIdx, codeFlowLength]);

  const onBack = useCallback(() => {
    if (consoleIdx > 0) {
      decrementStepIdx();
    }
  }, [consoleIdx]);
  const intervalRef = useRef<number | null>(null);
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(onForward, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, consoleIdx, codeFlowLength]);
  const fetchGuestActionRequest = async (req: any) => {
    try {
      const response = await fetch("http://localhost:8080/edupi-lms/v1/progress/send", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          classroomId: req.classroomId,
          action: req.action,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("An error occurred:", error);
      throw error;
    }
  };

  const useGuestActionMutation = () => {
    return useMutation({
      mutationFn: fetchGuestActionRequest,
      onSuccess: (data) => {
        console.log("Success:", data);
      },
      onError: (error) => {
        console.error("Submit Error:", error);
      },
    });
  };
  const guestActionMutation = useGuestActionMutation();
  const handleHelpRequest = () => {
    guestActionMutation.mutate({ classroomId: classroomId, action: 2 });
  };
  const handleCompleteRequest = () => {
    guestActionMutation.mutate({ classroomId: classroomId, action: 3 });
  };
  return (
    <CodeContext.Provider value={{ code, setCode }}>
      <PreprocessedCodesContext.Provider value={{ preprocessedCodes, setPreprocessedCodes }}>
        <LoggedInClassroomHeader />

        <main className={styles.main}>
          <div className={styles["top-btns"]}>
            <div>
              <button type="button" className={styles["playcode-btn"]}>
                <img src="/image/icon_play_w.svg" alt="" />
                실행코드
              </button>
            </div>
            <div>
              <form action="#" onSubmit={handleSubmit}>
                <button type="submit" className={styles["view-btn"]} data-testid="submit-button">
                  <img src="/image/icon_play_w.svg" alt="" />
                  시각화
                </button>
              </form>
              <div>
                <button>
                  <img src="/image/icon_play_back.svg" onClick={onBack} alt="뒤로" />
                </button>
                <button className="ml8">
                  {isPlaying ? (
                    <img src="/image/icon_play_stop.svg" onClick={onPlay} alt="일시정지" />
                  ) : (
                    <img src="/image/icon_play.svg" onClick={onPlay} alt="재생" />
                  )}
                </button>
                <button className="ml8">
                  <img src="/image/icon_play_next.svg" onClick={onForward} alt="다음" />
                </button>
                <p className={"ml14" + " fz14"}>
                  ({consoleIdx}/{codeFlowLength - 1 == -1 ? 0 : codeFlowLength - 1})
                </p>
                <p className={"ml24" + " fz14"}>Play Speed</p>
                <select name="" id="" className={styles.s__select + " ml14"}>
                  <option value="1x">1X</option>
                  <option value="2x">2X</option>
                </select>
              </div>
            </div>
          </div>

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
            style={{ display: "flex", width: "99vw", height: "89.2vh" }}
          >
            <LeftSection />
            <RightSection />
          </Split>
          <div className="floating-buttons">
            <button className="btn btn-help" onClick={handleHelpRequest}>
              <img
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'%3E%3C/circle%3E%3Cpath d='M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3'%3E%3C/path%3E%3Cline x1='12' y1='17' x2='12.01' y2='17'%3E%3C/line%3E%3C/svg%3E"
                alt="도움말 아이콘"
              />
              도움 요청
            </button>
            <button className="btn btn-complete" onClick={handleCompleteRequest}>
              <img
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M22 11.08V12a10 10 0 1 1-5.93-9.14'%3E%3C/path%3E%3Cpolyline points='22 4 12 14.01 9 11.01'%3E%3C/polyline%3E%3C/svg%3E"
                alt="완료 아이콘"
              />
              완료
            </button>
          </div>
        </main>
      </PreprocessedCodesContext.Provider>
    </CodeContext.Provider>
  );
};
export default VisualizationClassroom;