// Type: assign 부분
interface Variables {
  id: number;
  expr: string;
  name: string;
  type: string;
}
export interface VariablesDto {
  variables: Variables[];
  callStackName: string;
  type: string;
}

export const isVariablesDto = (item: any): item is VariablesDto => {
  return typeof item.variables === "object" && typeof item.type == "string" && typeof item.callStackName == "string";
};
