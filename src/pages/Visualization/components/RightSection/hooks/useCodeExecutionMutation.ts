import { useMutation } from "@tanstack/react-query";
import { runCode } from "@/services/api";
import { useCustomAlert } from "@/pages/components/CustomAlert";
import { useConsoleStore, useCodeFlowLengthStore } from "@/store/console";
import { useEditorStore } from "@/store/editor";
import { PreprocessedCodesContext } from "../../../context/PreProcessedCodesContext";
import { InputErrorContext } from "@/pages/Visualization/context/InputErrorContext";
import { useContext } from "react";
import { ApiError } from "../types";
import { handleExecutionError } from "../utils/errorHandler";

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
      setConsoleList([data.result.output || ""]);
      setHighlightLines([]);
    },
    onError(error: ApiError) {
      handleExecutionError({
        error,
        openAlert,
        setPreprocessedCodes,
        setConsoleList,
        setErrorLine,
        setIsInputError,
      });
    },
  });
};

