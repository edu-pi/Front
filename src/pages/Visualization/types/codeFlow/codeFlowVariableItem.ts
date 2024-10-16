export interface CodeFlowVariableItem {
  id: number;
  name: string;
  depth: number;
  isLight: boolean;
  type: string;
  expr: string;
  child: [];
}
