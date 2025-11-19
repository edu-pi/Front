import { CodeFlowItem } from "@/pages/Visualization/components/RightSection/types";

export interface CodeFlowTupleItem {
  id: number;
  depth: number;
  isLight: boolean;
  type: string;
  expr: string;
  child: CodeFlowItem[];
}
