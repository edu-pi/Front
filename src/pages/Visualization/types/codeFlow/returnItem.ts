export interface ReturnItem {
  id: number;
  returnName: string; // 변수가 반환되면 값이 들어옴
  returnValue: string;
  code: string;
  depth: number;
  type: string;
  highlights: number[];
  child: any[];
}
