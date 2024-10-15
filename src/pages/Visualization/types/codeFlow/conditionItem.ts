import { AllObjectItem } from "./allObjectItem";

export interface ConditionItem {
  id: number;
  type: string;
  expr?: string;
  highlights?: number[];
  depth: number;
  isLight: boolean;
  child: any[];
}
