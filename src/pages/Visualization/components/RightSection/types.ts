import { ValidTypeDto } from "@/pages/Visualization/types/dto/ValidTypeDto";
import {
  ForItem,
  PrintItem,
  ConditionItem,
  CodeFlowVariableItem,
  CodeFlowListItem,
  CodeFlowTupleItem,
  WhileItem,
  CallUserFuncItem,
  ReturnItem,
  InputItem,
  FlowControlItem,
  ElseItem,
} from "@/pages/Visualization/types/codeFlow";

export type CodeFlowItem =
  | ForItem
  | PrintItem
  | ConditionItem
  | CodeFlowVariableItem
  | CodeFlowListItem
  | CodeFlowTupleItem
  | WhileItem
  | CallUserFuncItem
  | ReturnItem
  | InputItem
  | FlowControlItem
  | ElseItem;

export interface State {
  objects: CodeFlowItem[];
}

export interface ApiError {
  code: string;
  result: {
    error: string[];
    lineNumber?: string;
    errorMessage?: string;
  };
  message: string;
}

export interface SuccessResponse {
  result: {
    code: ValidTypeDto[];
    output?: string;
  };
}

export interface RightSectionProps {
  onboardingStep: boolean[];
  setTutorialPosition: React.Dispatch<React.SetStateAction<{ top: number; left: number }>>;
}

