export interface CreateCallStackDto {
  args: [
    {
      expr: string;
      name: string;
      type: string;
    }
  ];
  callStack: string;
  code: string;
  type: string;
}
export const isCreateCallStackDto = (item: any): item is CreateCallStackDto => {
  return (
    typeof item.args === "object" &&
    typeof item.callStack === "string" &&
    typeof item.code === "string" &&
    typeof item.type === "string"
  );
};
