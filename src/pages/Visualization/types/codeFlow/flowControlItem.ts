import { CodeFlowItem } from "@/pages/Visualization/components/RightSection/types";

export interface FlowControlItem {
  id: number;
  expr: string;
  code: string;
  depth: number;
  type: string;
  isLight: boolean;
  child: CodeFlowItem[];
}
