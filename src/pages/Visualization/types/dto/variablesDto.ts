import { VariableDto } from "./variableDto";
// Type: assign 부분
export interface VariablesDto {
  variables: VariableDto[];
  callStack: string;
  type: string;
}

export const isVariablesDto = (item: any): item is VariablesDto => {
  return typeof item.variables === "object" && typeof item.type == "string" && typeof item.callStack == "string";
};
