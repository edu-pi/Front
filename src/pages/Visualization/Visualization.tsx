import { createContext, useState, Dispatch, SetStateAction, useCallback, useEffect, useRef } from "react";

import { useMutation } from "@tanstack/react-query";
import styles from "./Visualization.module.css";
import "./gutter.css";
import PublicHeader from "../components/PublicHeader";
import LoggedInHeader from "../components/LoggedInHeader";
import LeftSection from "./components/LeftSection/LeftSection";
import RightSection from "./components/RightSection/RightSection";
import GptComment from "./components/LeftSection/components/GptComment";
import GptIcon from "./components/LeftSection/components/GptIcon";
import { fetchVisualize } from "@/services/api";
import Split from "react-split";
import { ValidTypeDto, isValidTypeDtoArray } from "@/pages/Visualization/types/dto/ValidTypeDto";

//zustand store
import { useConsoleStore, useCodeFlowLengthStore } from "@/store/console";
import { useEditorStore } from "@/store/editor";
import { useArrowStore } from "@/store/arrow";
import { useUserStore } from "@/store/user";
import { useGptTooltipStore } from "@/store/gptTooltip";
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

export default function Visualization() {
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
  const userName = useUserStore((state) => state.userName);
  const setErrorLine = useEditorStore((state) => state.setErrorLine);
  const { focus } = useEditorStore();
  const isGptToggle = useGptTooltipStore((state) => state.isGptToggle);
  const gptPin = useGptTooltipStore((state) => state.gptPin);
  const setConsole = useConsoleStore((state) => state.setConsole);

  const [isPlaying, setIsPlaying] = useState(false);

  const mutation = useMutation({
    mutationFn: fetchVisualize,
    async onSuccess(data) {
      // 타입 체크 함수

      if (isValidTypeDtoArray(data.result.code)) {
        setPreprocessedCodes(data.result.code);
        setDisplayNone(false);
      } else {
        console.error("데이터 형식이 올바르지 않습니다");
        throw new Error("데이터 형식이 올바르지 않습니다");
      }
    },
    onError(error) {
      console.error("Submit Error:", error);
      if (error.message === "데이터 형식이 올바르지 않습니다") {
      } else {
        const linNumber = Number((error as any).result.error[0]);
        const message = (error as any).result.error;
        setErrorLine({ lineNumber: linNumber, message: message });

        setConsole([message]);
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

  return (
    <CodeContext.Provider value={{ code, setCode }}>
      <PreprocessedCodesContext.Provider value={{ preprocessedCodes, setPreprocessedCodes }}>
        {userName === "" ? <PublicHeader /> : <LoggedInHeader />}

        <main className={styles.main}>
          {focus && gptPin ? <GptIcon /> : (gptPin || isGptToggle) && <GptComment />}
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
        </main>
      </PreprocessedCodesContext.Provider>
    </CodeContext.Provider>
  );
}
