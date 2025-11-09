import { useMutation } from "@tanstack/react-query";
import { runCode } from "@/services/api";
import { useCustomAlert } from "@/pages/components/CustomAlert";
import { useConsoleStore, useCodeFlowLengthStore } from "@/store/console";
import { useEditorStore } from "@/store/editor";
import { PreprocessedCodesContext } from "../../../context/PreProcessedCodesContext";
import { InputErrorContext } from "@/pages/Visualization/context/InputErrorContext";
import { useContext } from "react";
import { ApiError } from "../types";

export const useCodeExecutionMutation = () => {
  const { openAlert } = useCustomAlert();
  const setConsoleList = useConsoleStore((state) => state.setConsoleList);
  const setStepIdx = useConsoleStore((state) => state.setStepIdx);
  const setCodeFlowLength = useCodeFlowLengthStore((state) => state.setCodeFlowLength);
  const setHighlightLines = useEditorStore((state) => state.setHighlightLines);
  const setErrorLine = useEditorStore((state) => state.setErrorLine);

  const preprocessedCodesContext = useContext(PreprocessedCodesContext);
  const inputErrorContext = useContext(InputErrorContext);

  if (!preprocessedCodesContext) {
    throw new Error("preprocessedCodesContext not found");
  }
  if (!inputErrorContext) {
    throw new Error("InputErrorContext not found");
  }

  const { setPreprocessedCodes } = preprocessedCodesContext;
  const { setIsInputError } = inputErrorContext;

  return useMutation({
    mutationFn: runCode,
    async onSuccess(data) {
      setPreprocessedCodes([]);
      setCodeFlowLength(0);
      setStepIdx(0);
      setConsoleList([data.result.output]);
      setHighlightLines([]);
    },
    onError(error: ApiError) {
      console.error(error);

      if (error.message === "데이터 형식이 올바르지 않습니다") {
        return;
      } else if (error.code === "CA-400006" || error.code === "CA-400999") {
        openAlert("지원하지 않는 코드가 포함되어 있습니다");
        return;
      } else if (error.code === "CA-400005") {
        setIsInputError(true);
        openAlert("입력된 input의 갯수가 적습니다.");
      } else if (error.code === "CA-400002") {
        // 잘못된 문법 에러처리
        const linNumber = Number(error.result.lineNumber);
        const errorMessage = error.result.errorMessage;
        if (errorMessage) {
          setErrorLine({ lineNumber: linNumber, message: errorMessage });
          setConsoleList([errorMessage]);
        }
        setPreprocessedCodes([]);
        return;
      } else if (error.code === "CA-400007") {
        openAlert("코드의 실행 횟수가 너무 많습니다.");
        return;
      }
      setConsoleList([]);
    },
  });
};

