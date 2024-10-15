// 오른쪽 콜스택 안에 들어가는 함수 컴포넌트
// type이 callUserFunc인 객체
export interface CreateFuncDto {
  variables: [
    {
      id: number;
      expr: string;
      name: string;
      code: string;
      type: string;
    }
  ];
  callStack: string;
  type: string;
}
export const isCreateFuncDto = (item: any): item is CreateFuncDto => {
  return typeof item.variables === "object" && typeof item.callStack === "string" && typeof item.type === "string";
};
