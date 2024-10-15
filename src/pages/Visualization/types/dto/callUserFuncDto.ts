// type이 callUserFunc인 객체
export interface CallUserFuncDto {
  id: number;
  assignName: string;
  expr: string;
  depth: number;
  code: string;
  type: string;
}
export const isCallUserFuncDto = (item: any): item is CallUserFuncDto => {
  return (
    typeof item.id === "number" &&
    typeof item.assignName === "string" &&
    typeof item.depth === "number" &&
    typeof item.expr === "string" &&
    typeof item.code === "string" &&
    typeof item.type === "string"
  );
};
