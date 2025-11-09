import { AppendDto } from "@/pages/Visualization/types/dto/appendDto";
import { State } from "../../types";
import { deleteCodeFlow } from "../../services/deleteCodeFlow";
import { WrapperDataStructureItem } from "@/pages/Visualization/types/dataStructuresItem/wrapperDataStructureItem";
import { DataStructureVarsItem } from "@/pages/Visualization/types/dataStructuresItem/dataStructureVarsItem";

interface ProcessAppendParams {
  preprocessedCode: AppendDto;
  accCodeFlow: State;
  accDataStructures: WrapperDataStructureItem;
  usedId: number[];
}

interface ProcessAppendResult {
  accCodeFlow: State;
  accDataStructures: WrapperDataStructureItem;
  usedId: number[];
  arrowText: string;
  highlightId: number;
}

export const processAppend = ({
  preprocessedCode,
  accCodeFlow,
  accDataStructures,
  usedId,
}: ProcessAppendParams): ProcessAppendResult => {
  const callStackName = preprocessedCode.callStackName;
  const variable = preprocessedCode.variable;
  const newAccDataStructures = { ...accDataStructures };
  const newUsedId = [...usedId];

  if (variable.type.toLowerCase() === "variable") {
    newAccDataStructures[callStackName].data.forEach((data: DataStructureVarsItem) => {
      if (data.name === variable.name) {
        data.highlightIdx = [data.expr.length - 1];
        if (data.expr[0] === "") {
          data.expr.shift();
          data.expr.push(variable.expr);
        } else {
          data.expr.push(variable.expr);
        }

        if (data.idx) {
          data.idx.start = data.expr.length - 1;
          data.idx.end = data.expr.length - 1;
        }
      }
    });
  }

  const deletedCodeFlow = deleteCodeFlow(accCodeFlow.objects, variable.id!);
  const filteredUsedId = newUsedId.filter((id) => id !== variable.id);

  return {
    accCodeFlow: { objects: deletedCodeFlow },
    accDataStructures: newAccDataStructures,
    usedId: filteredUsedId,
    arrowText: variable.code,
    highlightId: variable.id,
  };
};

