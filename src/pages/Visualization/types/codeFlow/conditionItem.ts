import { CodeFlowItem } from "@/pages/Visualization/components/RightSection/types";

export interface ConditionItem {
  id: number;
  type: string;
  expr?: string;
  highlights?: number[];
  depth: number;
  isLight: boolean;
  child: CodeFlowItem[];
}
