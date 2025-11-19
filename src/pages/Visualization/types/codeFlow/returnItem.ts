import { CodeFlowItem } from "@/pages/Visualization/components/RightSection/types";

export interface ReturnItem {
  id: number;
  returnExpr: string;
  isLight: boolean;
  code: string;
  depth: number;
  type: string;
  child: CodeFlowItem[];
}
