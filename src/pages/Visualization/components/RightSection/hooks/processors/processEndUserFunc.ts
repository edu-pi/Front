import { EndUserFuncDto } from "@/pages/Visualization/types/dto/endUserFuncDto";
import { State, CodeFlowItem } from "../../types";
import { createObjectToAdd } from "../../services/createObjectToAdd";
import { deleteCodeFlow } from "../../services/deleteCodeFlow";
import { insertIntoDepth } from "../../services/insertIntoDepth";
import { insertEqualToDepth } from "../../services/insertEqualToDepth";
import { addCodeFlow } from "../../services/addCodeFlow";
import { WrapperDataStructureItem } from "@/pages/Visualization/types/dataStructuresItem/wrapperDataStructureItem";
import { usedNameObjectType } from "@/pages/Visualization/types/dataStructuresItem/usedNameObjectType";

interface ProcessEndUserFuncParams {
  preprocessedCode: EndUserFuncDto;
  accCodeFlow: State;
  accDataStructures: WrapperDataStructureItem;
  usedName: usedNameObjectType;
  prevTrackingId: number;
  prevTrackingDepth: number;
}

interface ProcessEndUserFuncResult {
  accCodeFlow: State;
  accDataStructures: WrapperDataStructureItem;
  usedName: usedNameObjectType;
  arrowText: string;
  highlightId: number;
  newTrackingId: number;
  newTrackingDepth: number;
}

export const processEndUserFunc = ({
  preprocessedCode,
  accCodeFlow,
  accDataStructures,
  usedName,
  prevTrackingId,
  prevTrackingDepth,
}: ProcessEndUserFuncParams): ProcessEndUserFuncResult => {
  const delName = preprocessedCode.delFuncName;
  const newAccDataStructures = { ...accDataStructures };
  const newUsedName = { ...usedName };

  delete newAccDataStructures[delName];
  delete newUsedName[delName];

  const toAddObject = createObjectToAdd(preprocessedCode);
  toAddObject.isLight = true;

  const deletedCodeFlow = deleteCodeFlow(accCodeFlow.objects, preprocessedCode.id);
  let newAccCodeFlow = { objects: deletedCodeFlow };

  let finallyCodeFlow: CodeFlowItem[];
  if (toAddObject.depth > prevTrackingDepth) {
    finallyCodeFlow = insertIntoDepth(newAccCodeFlow.objects, toAddObject, prevTrackingId);
  } else if (toAddObject.depth === prevTrackingDepth) {
    finallyCodeFlow = insertEqualToDepth(newAccCodeFlow.objects, toAddObject, prevTrackingId);
  } else {
    finallyCodeFlow = addCodeFlow(newAccCodeFlow.objects, toAddObject);
  }

  newAccCodeFlow = { objects: finallyCodeFlow };

  return {
    accCodeFlow: newAccCodeFlow,
    accDataStructures: newAccDataStructures,
    usedName: newUsedName,
    arrowText: preprocessedCode.code,
    highlightId: preprocessedCode.id,
    newTrackingId: toAddObject.id!,
    newTrackingDepth: toAddObject.depth,
  };
};
