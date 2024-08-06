export interface WhileDto {
  id: number;
  depth: number;
  expr: string;
  type: string;
}

export const isWhileDto = (item: any): item is WhileDto => {
  return (
    typeof item.id === "number" &&
    typeof item.depth === "number" &&
    typeof item.expr === "string" &&
    typeof item.type === "string"
  );
};
