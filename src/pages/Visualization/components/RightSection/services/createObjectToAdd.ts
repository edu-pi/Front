import { AllObjectItem } from "@/pages/Visualization/types/codeFlow/allObjectItem";
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
import { CallUserFuncDto } from "@/pages/Visualization/types/dto/callUserFuncDto";
import { ReturnDto } from "@/pages/Visualization/types/dto/returnDto";
// 스택에 넣을 객체를 생성하는 함수
export const createObjectToAdd = (
  preprocessedCode: PrintDataToAdd | ForDataToAdd | IfElseDataToAdd | WhileDto | CallUserFuncDto | ReturnDto
): any => {
  const baseObject: AllObjectItem = {
    id: preprocessedCode.id!,
    type: preprocessedCode.type,
    depth: preprocessedCode.depth!,
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
      preprocessedCode.highlights?.map((highlight: any) => {
        highlight = highlight.toLowerCase();

        if (highlight === "cur") {
          isCurLight = true;
        }
        if (highlight === "start") {
          isStartLight = true;
        }
        if (highlight === "end") {
          isEndLight = true;
        }
        if (highlight === "step") {
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

    case "ifelsechange":
      return {
        ...baseObject,
        highlights: (preprocessedCode as IfElseChangeDataToAdd).highlights!,
        expr: (preprocessedCode as IfElseChangeDataToAdd).expr,
      };

    case "variable":
      return {
        ...baseObject,
        expr: (preprocessedCode as CodeFlowVariableDtoToAdd).expr,
      };
    case "list":
      return {
        ...baseObject,
        expr: (preprocessedCode as CodeFlowListDto).expr,
      };
    case "whilechangecondition":
      return {
        ...baseObject,
        type: "while",
        highlights: [],
        expr: (preprocessedCode as WhileDto).expr,
      };
    case "calluserfunc":
      return {
        ...baseObject,

        highlights: [],
        assignName: (preprocessedCode as CallUserFuncDto).assignName,
        signature: (preprocessedCode as CallUserFuncDto).signature,
      };
    case "return":
      return {
        ...baseObject,

        highlights: [],
        returnName: (preprocessedCode as ReturnDto).returnName,
        returnValue: (preprocessedCode as ReturnDto).returnValue,
      };
    default:
      throw new Error(`Unsupported type: ${type}`);
  }
};
