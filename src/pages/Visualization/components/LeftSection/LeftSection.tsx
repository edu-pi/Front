import { useContext, createContext, useState } from "react";
import { CodeContext } from "../../context/CodeContext";
import { Fragment } from "react/jsx-runtime";
import styles from "./LeftSection.module.css";
import CodeEditor from "./components/CodeEditor";
import Console from "./components/Console";
import Split from "react-split";
import { runCode } from "@/services/api";
import { useMutation } from "@tanstack/react-query";
import Dropdown from "./components/Dropdown";
import { useConsoleStore, useCodeFlowLengthStore } from "@/store/console";
import { useEditorStore } from "@/store/editor";
import { PreprocessedCodesContext } from "../../context/PreProcessedCodesContext";
import { InputErrorContext } from "@/pages/Visualization/context/InputErrorContext";
// 성공 응답 타입 정의

const LeftSection = () => {
  const preprocessedCodesContext = useContext(PreprocessedCodesContext); // context API로 데이터 가져오기

  if (!preprocessedCodesContext) {
    throw new Error("preprocessedCodesContext not found"); //context가 없을 경우 에러 출력 패턴 처리안해주면 에러 발생
  }
  const inputErrorContext = useContext(InputErrorContext);
  if (!inputErrorContext) {
    throw new Error("InputErrorContext not found");
  }
  const setErrorLine = useEditorStore((state) => state.setErrorLine);
  const setConsole = useConsoleStore((state) => state.setConsole);
  const setStepIdx = useConsoleStore((state) => state.setStepIdx);
  const { setPreprocessedCodes } = preprocessedCodesContext;
  const { setIsInputError } = inputErrorContext;
  const setCodeFlowLength = useCodeFlowLengthStore((state) => state.setCodeFlowLength);
  const setHighlightLines = useEditorStore((state) => state.setHighlightLines);

  const { inputData } = useConsoleStore();
  const codeContext = useContext(CodeContext);

  if (!codeContext) {
    throw new Error("CodeContext not found");
  }
  const { code } = codeContext;
  const mutation = useMutation({
    mutationFn: runCode,
    async onSuccess(data) {
      setPreprocessedCodes([]);
      setCodeFlowLength(0);
      setStepIdx(0);
      setConsole([data.result.output]);
      setHighlightLines([]);
    },
    onError(error) {
      console.error(error);

      if (error.message === "데이터 형식이 올바르지 않습니다") {
        return;
      } else if ((error as any).code === "CA-400006" || (error as any).code === "CA-400999") {
        alert("지원하지 않는 코드가 포함되어 있습니다");
        return;
      } else if ((error as any).code === "CA-400005") {
        setIsInputError(true);
        alert("입력된 input의 갯수가 적습니다.");
      } else if ((error as any).code === "CA-400002") {
        // 잘못된 문법 에러처리
        const linNumber = Number((error as any).result.lineNumber);
        const errorMessage = (error as any).result.errorMessage;
        setErrorLine({ lineNumber: linNumber, message: errorMessage });
        setConsole([errorMessage]);
        setPreprocessedCodes([]);
        return;
      } else if ((error as any).code == "CA-400007") {
        alert("코드의 실행 횟수가 너무 많습니다.");
        return;
      }
      setConsole([]);
    },
  });
  const handleRunCode = () => {
    mutation.mutate({ code, inputData });
  };

  return (
    <Fragment>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div className={styles["top-bar"]}>
          <p className={styles["view-section-title"]}>코드작성</p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              className={`${styles["playcode-btn"]} ${mutation.isPending ? styles["playcode-btn-loading"] : ""}`}
              onClick={handleRunCode}
              disabled={mutation.isPending} // 로딩 중에는 버튼 비활성화
            >
              <img src="/image/icon_play_w.svg" alt="" />
              코드실행
            </button>
            <Dropdown />
          </div>
        </div>

        <Split
          sizes={[60, 40]}
          minSize={100}
          expandToMin={false}
          gutterSize={10}
          gutterAlign="center"
          snapOffset={30}
          dragInterval={1}
          direction="vertical"
          cursor="row-resize"
          style={{ display: "flex", flexDirection: "column", height: "94%" }}
          className={styles.splitContainer}
        >
          <CodeEditor />

          <Console />
        </Split>
      </div>
    </Fragment>
  );
};

export default LeftSection;
