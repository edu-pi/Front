import { useMutation } from "@tanstack/react-query";
import { visualize } from "@/services/api";
import { useCustomAlert } from "@/pages/components/CustomAlert";
import { useConsoleStore } from "@/store/console";
import { useEditorStore } from "@/store/editor";
import { useArrowStore } from "@/store/arrow";
import { PreprocessedCodesContext } from "../../../context/PreProcessedCodesContext";
import { InputErrorContext } from "@/pages/Visualization/context/InputErrorContext";
import { useContext } from "react";
import { isNotServiceDtoType } from "../services/isNotServiceDtoType";
import { isValidTypeDtoArray } from "@/pages/Visualization/types/dto/ValidTypeDto";
import { SuccessResponse, ApiError } from "../types";
import { handleVisualizationError } from "../utils/errorHandler";

interface UseCodeVisualizationMutationProps {
  setIsPlaying: (value: boolean) => void;
}

export const useCodeVisualizationMutation = ({ setIsPlaying }: UseCodeVisualizationMutationProps) => {
  const { openAlert } = useCustomAlert();
  const resetConsole = useConsoleStore((state) => state.resetConsole);
  const setConsoleList = useConsoleStore((state) => state.setConsoleList);
  const setErrorLine = useEditorStore((state) => state.setErrorLine);
  const setDisplayNone = useArrowStore((state) => state.setDisplayNone);

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

  return useMutation<SuccessResponse, ApiError, Parameters<typeof visualize>[0]>({
    mutationFn: visualize,
    async onSuccess(data) {
      if (isNotServiceDtoType(data.result.code)) {
        throw new Error("시각화를 지원하지 않는 코드가 포함되어 있습니다.");
      }
      if (isValidTypeDtoArray(data.result.code)) {
        resetConsole();
        setPreprocessedCodes(data.result.code);
        setDisplayNone(false);
        setIsPlaying(true);
      } else {
        throw new Error("데이터 형식이 올바르지 않습니다");
      }
    },
    onError(error) {
      handleVisualizationError({
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

