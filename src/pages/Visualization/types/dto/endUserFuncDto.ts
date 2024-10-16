export interface EndUserFuncDto {
  id: number;
  returnExpr: string; // 반환값이 없으면 빈문자열
  name: string;
  depth: number;
  code: string;
  type: string;
  delFuncName: string;
  delFuncId: number;
}

export const isEndUserFuncDto = (item: any): item is EndUserFuncDto => {
  return (
    typeof item.id === "number" &&
    typeof item.name === "string" &&
    typeof item.returnExpr === "string" &&
    typeof item.depth === "number" &&
    typeof item.code === "string" &&
    typeof item.type === "string" &&
    typeof item.delFuncName === "string" &&
    typeof item.delFuncId === "number"
  );
};
