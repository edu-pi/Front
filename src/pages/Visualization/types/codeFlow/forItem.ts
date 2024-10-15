import { AllObjectItem } from "./allObjectItem";
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
  child: any[];
}
