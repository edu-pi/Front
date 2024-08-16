import { createContext, useState, Dispatch, SetStateAction, useCallback, useEffect, useRef } from "react";

import { useMutation } from "@tanstack/react-query";
import styles from "./Home.module.css";
import "./gutter.css";
import LoggedInHeader from "../components/LoggedInHeader";
import LeftSection from "./components/LeftSection/LeftSection";
import RightSection from "./components/RightSection/RightSection";

import Split from "react-split";
import { ValidTypeDto, isValidTypeDtoArray } from "@/pages/Home/types/dto/ValidTypeDto";

//zustand store
import { useConsoleStore, useCodeFlowLengthStore } from "@/store/console";
import { useArrowStore } from "@/store/arrow";
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

export default function Home() {
  const [code, setCode] = useState<any>(
    ["a = 3", "for i in range(a):", "   print(' ' * ((a - 1) - i), end = '')", "   print('*' * (2 * i + 1))"].join("\n")
  );
  const [preprocessedCodes, setPreprocessedCodes] = useState<ValidTypeDto[]>([]);
  // zustand store
  const consoleIdx = useConsoleStore((state) => state.consoleIdx);
  const resetConsole = useConsoleStore((state) => state.resetConsole);
  const incrementConsoleIdx = useConsoleStore((state) => state.incrementConsoleIdx);
  const decrementConsoleIdx = useConsoleStore((state) => state.decrementConsoleIdx);
  const codeFlowLength = useCodeFlowLengthStore((state) => state.codeFlowLength);
  const setDisplayNone = useArrowStore((state) => state.setDisplayNone);
  const [isPlaying, setIsPlaying] = useState(false);

  const mutation = useMutation({
    mutationFn: async (code: string) => {
      return fetch("http://localhost:8080/edupi_visualize/v1/python", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ source_code: code }),
      });
    },
    async onSuccess(data) {
      try {
        const jsonData = await data.json();
        // 타입 체크 함수
        if (isValidTypeDtoArray(jsonData)) {
          setPreprocessedCodes(jsonData);
          setDisplayNone(false);
        } else {
          throw new Error("받은 데이터가 올바르지 않습니다");
        }
      } catch (error) {
        console.error("Data processing error:", error);
        alert("받은 데이터의 형식이 올바르지 않습니다.");
      }
    },
    onError(error) {
      console.error("Submit Error:", error);
      alert("코드 처리 중 에러가 발생했습니다.");
    },
  });
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetConsole();
    mutation.mutate(code);
  };

  const onPlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const onForward = useCallback(() => {
    if (consoleIdx < codeFlowLength - 1) {
      incrementConsoleIdx();
    }
  }, [consoleIdx, codeFlowLength]);

  const onBack = useCallback(() => {
    if (consoleIdx > 0) {
      decrementConsoleIdx();
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
  }, [isPlaying, consoleIdx]);
  let interval = 0;
  useEffect(() => {
    if (isPlaying) {
      interval = setInterval(onForward, 1000);
    } else {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isPlaying, consoleIdx]);

  return (
    <CodeContext.Provider value={{ code, setCode }}>
      <PreprocessedCodesContext.Provider value={{ preprocessedCodes, setPreprocessedCodes }}>
        <LoggedInHeader />

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
                <p className={"ml14" + " fz14"}>(23/23)</p>
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
            style={{ display: "flex", width: "100vw", height: "87vh" }}
          >
            <LeftSection />
            <RightSection />
          </Split>
        </main>
      </PreprocessedCodesContext.Provider>
    </CodeContext.Provider>
  );
}
