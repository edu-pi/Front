export interface ReturnDto {
  id: number;
  returnName: string; // 변수가 반환되면 값이 들어옴
  returnValue: string;
  code: string;
  depth: number;
  type: string;
}

export const isReturnDto = (item: any): item is ReturnDto => {
  return (
    typeof item.id === "number" &&
    typeof item.returnName === "string" &&
    typeof item.returnValue === "string" &&
    typeof item.code === "string" &&
    typeof item.depth === "number" &&
    typeof item.type === "string"
  );
};
