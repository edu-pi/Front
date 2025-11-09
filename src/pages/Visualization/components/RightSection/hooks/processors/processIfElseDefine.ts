import { IfElseDto } from "@/pages/Visualization/types/dto/ifElseDto";
import { State } from "../../types";
import { createObjectToAdd } from "../../services/createObjectToAdd";
import { turnOffAllNodeLight } from "../../services/turnOffAllNodeLight";
import { insertIntoDepth } from "../../services/insertIntoDepth";
import { insertEqualToDepth } from "../../services/insertEqualToDepth";
import { addCodeFlow } from "../../services/addCodeFlow";

interface ProcessIfElseDefineParams {
  preprocessedCode: IfElseDto;
  accCodeFlow: State;
  usedId: number[];
  prevTrackingId: number;
  prevTrackingDepth: number;
}

interface ProcessIfElseDefineResult {
  accCodeFlow: State;
  usedId: number[];
  arrowText: string;
  highlightId: number;
  newTrackingId: number;
  newTrackingDepth: number;
}

export const processIfElseDefine = ({
  preprocessedCode,
  accCodeFlow,
  usedId,
  prevTrackingId,
  prevTrackingDepth,
}: ProcessIfElseDefineParams): ProcessIfElseDefineResult => {
  const newUsedId = [...usedId];
  let newAccCodeFlow = { objects: turnOffAllNodeLight(accCodeFlow.objects) };
  let newTrackingId = prevTrackingId;
  let newTrackingDepth = prevTrackingDepth;

  for (let condition of preprocessedCode.conditions) {
    const ifElseItem = Object.assign(condition, {
      depth: preprocessedCode.depth,
      code: preprocessedCode.code,
    });
    const toAddObject = createObjectToAdd(ifElseItem);
    toAddObject.isLight = true;

    newUsedId.push(toAddObject.id!);

    let finallyCodeFlow: any;
    if (toAddObject.depth > newTrackingDepth) {
      finallyCodeFlow = insertIntoDepth(newAccCodeFlow.objects, toAddObject, newTrackingId);
    } else if (toAddObject.depth === newTrackingDepth) {
      finallyCodeFlow = insertEqualToDepth(newAccCodeFlow.objects, toAddObject, newTrackingId);
    } else {
      finallyCodeFlow = addCodeFlow(newAccCodeFlow.objects, toAddObject);
    }

    newAccCodeFlow = { objects: finallyCodeFlow };
    newTrackingId = toAddObject.id!;
    newTrackingDepth = toAddObject.depth;
  }

  return {
    accCodeFlow: newAccCodeFlow,
    usedId: newUsedId,
    arrowText: preprocessedCode.code,
    highlightId: preprocessedCode.conditions[0].id,
    newTrackingId,
    newTrackingDepth,
  };
};
