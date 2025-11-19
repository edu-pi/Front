import { CodeFlowItem } from "@/pages/Visualization/components/RightSection/types";

export interface InputItem {
  id: number;
  expr: string;
  isLight: boolean;
  console: string;
  code: string;
  depth: number;
  type: string;
  child: CodeFlowItem[];
}
