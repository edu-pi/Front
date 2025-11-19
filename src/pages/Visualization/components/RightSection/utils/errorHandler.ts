import { ApiError } from "../types";
import { ValidTypeDto } from "@/pages/Visualization/types/dto/ValidTypeDto";

interface ErrorHandlerParams {
  error: ApiError;
  openAlert: (message: string) => void;
  setPreprocessedCodes: (codes: ValidTypeDto[]) => void;
  setConsoleList: (list: string[]) => void;
  setErrorLine: (error: { lineNumber: number; message: string }) => void;
  setIsInputError: (value: boolean) => void;
}

const handleCommonErrors = (
  error: ApiError,
  openAlert: (message: string) => void,
  setIsInputError: (value: boolean) => void
): boolean => {
  if (error.message === "데이터 형식이 올바르지 않습니다") {
    return true;
  }

  if (error.code === "CA-400006" || error.code === "CA-400999") {
    openAlert("지원하지 않는 코드가 포함되어 있습니다.");
    return true;
  }

  if (error.code === "CA-400005") {
    setIsInputError(true);
    openAlert("입력된 input의 개수가 적습니다.");
    return true;
  }

  if (error.code === "CA-400007") {
    openAlert("코드의 실행 횟수가 너무 많습니다.");
    return true;
  }

  return false;
};

export const handleVisualizationError = ({
  error,
  openAlert,
  setPreprocessedCodes,
  setConsoleList,
  setErrorLine,
  setIsInputError,
}: ErrorHandlerParams): void => {
  if (handleCommonErrors(error, openAlert, setIsInputError)) {
    return;
  }

  if (error.message === "시각화를 지원하지 않는 코드가 포함되어 있습니다.") {
    openAlert("시각화를 지원하지 않는 코드가 포함되어 있습니다.");
    return;
  }

  if (error.code === "CA-400002") {
    const lineNumber = Number(error.result.lineNumber);
    const errorMessage = error.result.errorMessage;
    if (errorMessage) {
      setErrorLine({ lineNumber, message: errorMessage });
      setConsoleList([errorMessage]);
    }
    setPreprocessedCodes([]);
    return;
  }

  setConsoleList([]);
  setPreprocessedCodes([]);
};

export const handleExecutionError = ({
  error,
  openAlert,
  setPreprocessedCodes,
  setConsoleList,
  setErrorLine,
  setIsInputError,
}: ErrorHandlerParams): void => {
  if (handleCommonErrors(error, openAlert, setIsInputError)) {
    return;
  }

  if (error.code === "CA-400002") {
    const lineNumber = Number(error.result.lineNumber);
    const errorMessage = error.result.errorMessage;
    if (errorMessage) {
      setErrorLine({ lineNumber, message: errorMessage });
      setConsoleList([errorMessage]);
    }
    setPreprocessedCodes([]);
    return;
  }

  setConsoleList([]);
};

