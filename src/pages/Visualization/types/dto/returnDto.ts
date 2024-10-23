export interface ReturnDto {
  id: number;
  returnExpr: string;
  code: string;
  depth: number;
  type: string;
}

export const isReturnDto = (item: any): item is ReturnDto => {
  return (
    typeof item.id === "number" &&
    typeof item.returnExpr === "string" &&
    typeof item.code === "string" &&
    typeof item.depth === "number" &&
    typeof item.type === "string"
  );
};
