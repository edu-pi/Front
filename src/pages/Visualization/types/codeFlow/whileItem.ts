import { AllObjectItem } from "./allObjectItem";

export interface WhileItem {
  id: number;
  type: string;
  expr: string;
  highlights: number[];
  depth: number;
  isLight: boolean;
  child: any[];
}
