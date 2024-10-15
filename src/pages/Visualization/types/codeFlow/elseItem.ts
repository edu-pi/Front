// else박스 안에 들어갈 수 있는 객체들을 정의한 타입
import { AllObjectItem } from "./allObjectItem";
export interface ElseItem {
  id: number;
  type: string;
  depth: number;
  isLight: boolean;
  child: any[];
}
