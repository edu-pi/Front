export interface CallUserFuncItem {
  id: number;
  type: string;
  depth: number;
  isLight: boolean;
  assignName: string;
  signature: string;
  highlights: number[];
  child: any[];
}
