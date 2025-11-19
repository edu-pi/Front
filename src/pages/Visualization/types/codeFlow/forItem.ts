import { CodeFlowItem } from "@/pages/Visualization/components/RightSection/types";

export interface ForItem {
  id: number;
  start: string;
  isStartLight: boolean;
  end: string;
  isEndLight: boolean;
  cur: string;
  isCurLight: boolean;
  target: string;
  step: string;
  isStepLight: boolean;
  type: string;
  depth: number;
  isLight: boolean;
  child: CodeFlowItem[];
}
