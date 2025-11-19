import { VariablesDto, VariableExprArray } from "@/pages/Visualization/types/dto/variablesDto";
import { State } from "../../types";
import { deleteCodeFlow } from "../../services/deleteCodeFlow";
import { updateDataStructure } from "../../services/updateDataStructure";
import { WrapperDataStructureItem } from "@/pages/Visualization/types/dataStructuresItem/wrapperDataStructureItem";
import { usedNameObjectType } from "@/pages/Visualization/types/dataStructuresItem/usedNameObjectType";

interface ProcessAssignParams {
  preprocessedCode: VariablesDto;
  accCodeFlow: State;
  accDataStructures: WrapperDataStructureItem;
  usedName: usedNameObjectType;
  usedId: number[];
}

interface ProcessAssignResult {
  accCodeFlow: State;
  accDataStructures: WrapperDataStructureItem;
  usedName: usedNameObjectType;
  usedId: number[];
  arrowTexts: string[];
  highlightIds: number[];
}

export const processAssign = ({
  preprocessedCode,
  accCodeFlow,
  accDataStructures,
  usedName,
  usedId,
}: ProcessAssignParams): ProcessAssignResult => {
  const callStackName = preprocessedCode.callStackName;
  const newAccDataStructures = { ...accDataStructures };
  const newUsedName = { ...usedName };
  const newUsedId = [...usedId];
  const arrowTexts: string[] = [];
  const highlightIds: number[] = [];

  // 함수 타입 처리
  if (preprocessedCode.variables[0].type.toLowerCase() === "function") {
    const { id, expr, name, type, code } = preprocessedCode.variables[0];
    highlightIds.push(id);
    const highlightIdx = new Array(expr.length).fill(0).map((_, idx) => idx + 1);
    const exprArray = [expr];
    newAccDataStructures[callStackName].data.push({
      id,
      expr: exprArray as string[],
      name,
      type,
      highlightIdx,
    });
    arrowTexts.push(code);
  } else {
    // 변수 타입 처리
    preprocessedCode.variables.forEach((variable) => {
      // expr 변환
      if (variable.type.toLowerCase() === "variable") {
        if (typeof variable.expr === "string") {
          (variable as VariableExprArray).expr = variable.expr.split(",");
        }
      } else if (variable.type.toLowerCase() === "list" || variable.type.toLowerCase() === "tuple") {
        if (typeof variable.expr === "string") {
          (variable as VariableExprArray).expr = variable.expr.slice(1, -1).split(",");
        }
      }

      highlightIds.push(variable.id);
      arrowTexts.push(variable.code);

      // 자료구조 업데이트 또는 추가
      if (newUsedName[callStackName].includes(variable.name!)) {
        const targetName = variable.name!;
        Object.assign(
          newAccDataStructures,
          updateDataStructure(targetName, newAccDataStructures, variable as VariableExprArray, callStackName)
        );
      } else {
        newAccDataStructures[callStackName].data.push(variable as VariableExprArray);
        newUsedName[callStackName].push(variable.name!);
      }

      // 코드 흐름에서 삭제
      const deletedCodeFlow = deleteCodeFlow(accCodeFlow.objects, variable.id!);
      accCodeFlow = { objects: deletedCodeFlow };
      const filteredUsedId = newUsedId.filter((id) => id !== variable.id);
      newUsedId.length = 0;
      newUsedId.push(...filteredUsedId);
    });
  }

  return {
    accCodeFlow,
    accDataStructures: newAccDataStructures,
    usedName: newUsedName,
    usedId: newUsedId,
    arrowTexts,
    highlightIds,
  };
};

