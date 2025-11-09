import { CreateCallStackDto } from "@/pages/Visualization/types/dto/createCallStackDto";
import { WrapperDataStructureItem } from "@/pages/Visualization/types/dataStructuresItem/wrapperDataStructureItem";
import { usedNameObjectType } from "@/pages/Visualization/types/dataStructuresItem/usedNameObjectType";

interface ProcessCreateCallStackParams {
  preprocessedCode: CreateCallStackDto;
  accDataStructures: WrapperDataStructureItem;
  usedName: usedNameObjectType;
}

interface ProcessCreateCallStackResult {
  accDataStructures: WrapperDataStructureItem;
  usedName: usedNameObjectType;
  arrowText: string;
  highlightId: number;
}

export const processCreateCallStack = ({
  preprocessedCode,
  accDataStructures,
  usedName,
}: ProcessCreateCallStackParams): ProcessCreateCallStackResult => {
  const callStackName = preprocessedCode.callStackName;
  const newAccDataStructures = { ...accDataStructures };
  const newUsedName = { ...usedName };

  newAccDataStructures[callStackName] = { data: [], isLight: false };

  preprocessedCode.args.forEach((arg) => {
    if (arg.type === "list" || arg.type === "tuple") {
      newAccDataStructures[callStackName].data.push({
        expr: arg.expr.slice(1, -1).split(","),
        name: arg.name,
        type: arg.type,
        idx: { start: arg.idx.start, end: arg.idx.end },
      });
    } else if (arg.type === "variable") {
      newAccDataStructures[callStackName].data.push({
        expr: arg.expr.split(","),
        name: arg.name,
        type: arg.type,
        idx: { start: arg.idx.start, end: arg.idx.end },
      });
    }
  });

  newAccDataStructures[callStackName].isLight = true;
  newUsedName[callStackName] = [];

  return {
    accDataStructures: newAccDataStructures,
    usedName: newUsedName,
    arrowText: preprocessedCode.code,
    highlightId: preprocessedCode.id,
  };
};

