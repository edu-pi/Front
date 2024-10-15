import { ForDto, isForDto } from "./forDto";
import { PrintDto, isPrintDto } from "./printDto";
import { VariablesDto, isVariablesDto } from "./variablesDto";
import { IfElseDto, isIfElseDto } from "./ifElseDto";
import { IfElseChangeDto, isIfElseChangeDto } from "./ifElseChangeDto";
import { CodeFlowVariableDto, isCodeFlowVariableDto } from "./codeFlowVariableDto";
import { WhileDto, isWhileDto } from "./whileDto";
import { CallUserFuncDto, isCallUserFuncDto } from "./callUserFuncDto";
import { CreateCallStackDto, isCreateCallStackDto } from "./createCallStackDto";
import { EndUserFuncDto, isEndUserFuncDto } from "./endUserFuncDto";
import { CreateFuncDto, isCreateFuncDto } from "./createFuncDto";
import { ReturnDto, isReturnDto } from "./returnDto";
export type ValidTypeDto =
  | ForDto
  | PrintDto
  | VariablesDto
  | IfElseDto
  | IfElseChangeDto
  | CodeFlowVariableDto
  | WhileDto
  | CallUserFuncDto
  | CreateFuncDto
  | CreateCallStackDto
  | EndUserFuncDto
  | ReturnDto;

export const isValidTypeDto = (item: any): item is ValidTypeDto => {
  return (
    isForDto(item) ||
    isPrintDto(item) ||
    isVariablesDto(item) ||
    isIfElseDto(item) ||
    isIfElseChangeDto(item) ||
    isCodeFlowVariableDto(item) ||
    isWhileDto(item) ||
    isCallUserFuncDto(item) ||
    isCreateFuncDto(item) ||
    isCreateCallStackDto(item) ||
    isEndUserFuncDto(item) ||
    isReturnDto(item)
  );
};

export const isValidTypeDtoArray = (data: any): data is ValidTypeDto[] => {
  return Array.isArray(data) && data.every(isValidTypeDto);
};
