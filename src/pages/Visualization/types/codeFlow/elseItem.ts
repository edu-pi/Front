import { CodeFlowItem } from "@/pages/Visualization/components/RightSection/types";

export interface ElseItem {
  id: number;
  type: string;
  depth: number;
  isLight: boolean;
  child: CodeFlowItem[];
}
