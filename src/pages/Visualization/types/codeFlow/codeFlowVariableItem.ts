import { CodeFlowItem } from "@/pages/Visualization/components/RightSection/types";

export interface CodeFlowVariableItem {
  id: number;
  name: string;
  depth: number;
  isLight: boolean;
  console?: string;
  type: string;
  expr: string;
  child: CodeFlowItem[];
}
