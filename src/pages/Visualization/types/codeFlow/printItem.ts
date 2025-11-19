import { CodeFlowItem } from "@/pages/Visualization/components/RightSection/types";

export interface PrintItem {
  id: number;
  type: string;
  depth: number;
  isLight: boolean;
  expr: string;
  console: string;
  highlights: number[];
  child: CodeFlowItem[];
}
