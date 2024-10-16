export interface EndUserFuncDto {
  id: number;
  returnValue: string; // 반환값이 없으면 빈문자열
  depth: number;
  type: string;
}

export const isEndUserFuncDto = (item: any): item is EndUserFuncDto => {
  return (
    typeof item.id === "number" &&
    typeof item.returnValue === "string" &&
    typeof item.depth === "number" &&
    typeof item.type === "string"
  );
};
