import { ForItem } from "@/pages/Visualization/types/codeFlow/forItem";
import { ConditionItem } from "@/pages/Visualization/types/codeFlow/conditionItem";
import { PrintItem } from "@/pages/Visualization/types/codeFlow/printItem";
import { ForDataToAdd } from "@/pages/Visualization/types/dataToAdd/forDataToAdd";
import { PrintDataToAdd } from "@/pages/Visualization/types/dataToAdd/printDataToAdd";
import { IfElseDataToAdd } from "@/pages/Visualization/types/dataToAdd/ifElseDataToAdd";
import { IfElseChangeDataToAdd } from "@/pages/Visualization/types/dataToAdd/ifElseChangeDataToAdd";
import { CodeFlowVariableDtoToAdd } from "@/pages/Visualization/types/dataToAdd/codeFlowVariableDataToAdd";
import { WhileDto } from "@/pages/Visualization/types/dto/whileDto";
import { CodeFlowListDto } from "@/pages/Visualization/types/dto/codeFlowListDto";
import { CodeFlowTupleDto } from "@/pages/Visualization/types/dto/codeFlowTupleDto";
import { CallUserFuncDto } from "@/pages/Visualization/types/dto/callUserFuncDto";
import { ReturnDto } from "@/pages/Visualization/types/dto/returnDto";
import { FlowControlDto } from "@/pages/Visualization/types/dto/flowControlDto";
import { EndUserFuncDto } from "@/pages/Visualization/types/dto/endUserFuncDto";
import { InputDto } from "@/pages/Visualization/types/dto/inputDto";
import { CodeFlowItem } from "../types";

export const createObjectToAdd = (
  preprocessedCode:
    | PrintDataToAdd
    | ForDataToAdd
    | IfElseDataToAdd
    | WhileDto
    | CallUserFuncDto
    | ReturnDto
    | FlowControlDto
    | EndUserFuncDto
): CodeFlowItem => {
  const baseObject: Partial<CodeFlowItem> = {
    id: preprocessedCode.id!,
    type: preprocessedCode.type,
    depth: preprocessedCode.depth!,
    code: preprocessedCode.code!,
    isLight: false,
    child: [],
  };

  const type: string = preprocessedCode.type.toLowerCase();

  switch (type) {
    case "print":
      return {
        ...baseObject,
        expr: (preprocessedCode as PrintDataToAdd).expr!,
        highlights: (preprocessedCode as PrintDataToAdd).highlights!,
        console: (preprocessedCode as PrintDataToAdd).console,
      } as PrintItem;

    case "for":
      preprocessedCode = preprocessedCode as ForDataToAdd;

      let isCurLight = false;
      let isStartLight = false;
      let isEndLight = false;
      let isStepLight = false;
      preprocessedCode.highlights?.forEach((highlight) => {
        const lowerHighlight = highlight.toLowerCase();

        if (lowerHighlight === "cur") {
          isCurLight = true;
        }
        if (lowerHighlight === "start") {
          isStartLight = true;
        }
        if (lowerHighlight === "end") {
          isEndLight = true;
        }
        if (lowerHighlight === "step") {
          isStepLight = true;
        }
      });

      return {
        ...baseObject,
        start: preprocessedCode.condition!.start,
        end: preprocessedCode.condition!.end,
        cur: preprocessedCode.condition!.cur,
        target: preprocessedCode.condition!.target,
        step: preprocessedCode.condition!.step,
        isStartLight: isStartLight,
        isEndLight: isEndLight,
        isCurLight: isCurLight,
        isStepLight: isStepLight,
      } as ForItem;

    case "if":
      return {
        ...(baseObject as ConditionItem),
        highlights: [],
        expr: (preprocessedCode as IfElseDataToAdd).expr,
      };

    case "elif":
      return {
        ...(baseObject as ConditionItem),
        highlights: [],
        expr: (preprocessedCode as IfElseDataToAdd).expr,
      };

    case "else":
      return {
        ...(baseObject as ConditionItem),
        highlights: [],
        expr: (preprocessedCode as IfElseDataToAdd).expr,
      };
    case "input":
      return {
        ...(baseObject as InputDto),
        highlights: [],
        expr: (preprocessedCode as InputDto).expr,
        console: (preprocessedCode as InputDto).console,
      };
    case "ifelsechange":
      return {
        ...baseObject,
        highlights: (preprocessedCode as IfElseChangeDataToAdd).highlights!,
        expr: (preprocessedCode as IfElseChangeDataToAdd).expr,
      };

    case "variable":
      return {
        ...baseObject,
        console: (preprocessedCode as CodeFlowVariableDtoToAdd)?.console,
        expr: (preprocessedCode as CodeFlowVariableDtoToAdd).expr,
      };
    case "list":
      return {
        ...baseObject,
        expr: (preprocessedCode as CodeFlowListDto).expr,
      };
    case "tuple":
      return {
        ...baseObject,
        expr: (preprocessedCode as CodeFlowTupleDto).expr,
      };
    case "whilechangecondition":
      return {
        ...baseObject,
        type: "while",
        expr: (preprocessedCode as WhileDto).expr,
      };
    case "calluserfunc":
      return {
        ...baseObject,
        assignName: (preprocessedCode as CallUserFuncDto).assignName,
        signature: (preprocessedCode as CallUserFuncDto).signature,
      };
    case "return":
      return {
        ...baseObject,
        returnExpr: (preprocessedCode as ReturnDto).returnExpr,
      };
    case "flowcontrol":
      return {
        ...baseObject,
        expr: (preprocessedCode as FlowControlDto).expr,
      };
    case "enduserfunc":
      return {
        ...baseObject,
        type: "variable",
        name: (preprocessedCode as EndUserFuncDto).returnName,
        expr: (preprocessedCode as EndUserFuncDto).returnExpr,
      };

    default:
      throw new Error(`Unsupported type: ${type}`);
  }
} as CodeFlowItem;
