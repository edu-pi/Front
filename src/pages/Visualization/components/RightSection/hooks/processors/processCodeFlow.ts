import { ForDto } from "@/pages/Visualization/types/dto/forDto";
import { PrintDto } from "@/pages/Visualization/types/dto/printDto";
import { IfElseChangeDto } from "@/pages/Visualization/types/dto/ifElseChangeDto";
import { CodeFlowVariableDto } from "@/pages/Visualization/types/dto/codeFlowVariableDto";
import { WhileDto } from "@/pages/Visualization/types/dto/whileDto";
import { PrintItem } from "@/pages/Visualization/types/codeFlow/printItem";
import { InputItem } from "@/pages/Visualization/types/codeFlow/inputItem";
import { CodeFlowVariableItem } from "@/pages/Visualization/types/codeFlow/codeFlowVariableItem";
import { State, CodeFlowItem } from "../../types";
import { createObjectToAdd } from "../../services/createObjectToAdd";
import { updateCodeFlow } from "../../services/updateCodeFlow";
import { refreshCodeFlow } from "../../services/refreshCodeFlow";
import { findTargetChild } from "../../services/findTargetChild";
import { findDeleteUsedId } from "../../services/findDeleteUsedId";
import { insertIntoDepth } from "../../services/insertIntoDepth";
import { insertEqualToDepth } from "../../services/insertEqualToDepth";
import { addCodeFlow } from "../../services/addCodeFlow";
import { updateActivate } from "../../services/updateActivate";
import { LightCodeFlow } from "../../services/LightCodeFlow";
import { ActivateItem } from "@/pages/Visualization/types/activateItem";

interface ProcessCodeFlowParams {
  preprocessedCode: ForDto | PrintDto | IfElseChangeDto | CodeFlowVariableDto | WhileDto;
  accCodeFlow: State;
  usedId: number[];
  activate: ActivateItem[];
  prevTrackingId: number;
  prevTrackingDepth: number;
}

interface ProcessCodeFlowResult {
  accCodeFlow: State;
  usedId: number[];
  activate: ActivateItem[];
  arrowText: string;
  highlightId: number;
  consoleLog: string;
  newTrackingId: number;
  newTrackingDepth: number;
}

export const processCodeFlow = ({
  preprocessedCode,
  accCodeFlow,
  usedId,
  activate,
  prevTrackingId,
  prevTrackingDepth,
}: ProcessCodeFlowParams): ProcessCodeFlowResult => {
  const newUsedId = [...usedId];
  let newActivate = [...activate];
  let consoleLog = "";

  const toAddObject = createObjectToAdd(
    preprocessedCode as ForDto | PrintDto | IfElseChangeDto | CodeFlowVariableDto
  );

  // Console log 처리
  if ((toAddObject as PrintItem).type === "print") {
    const printObject = toAddObject as PrintItem;
    if (printObject.console !== null) {
      consoleLog = printObject.console;
    }
  } else if ((toAddObject as InputItem).type === "input") {
    const inputObject = toAddObject as InputItem;
    if (inputObject.console !== null) {
      consoleLog = inputObject.console;
    }
  } else if ((toAddObject as CodeFlowVariableItem).type === "variable") {
    const variableObject = toAddObject as CodeFlowVariableItem;
    if (variableObject.console !== undefined) {
      consoleLog = variableObject.console;
    }
  }

  let changedCodeFlows: CodeFlowItem[];
  if (newUsedId.includes(toAddObject.id!)) {
    // 기존 항목 업데이트
    if (toAddObject.type === "for" || toAddObject.type === "while") {
      const targetChild = findTargetChild(accCodeFlow.objects, toAddObject);
      const idsToDelete = findDeleteUsedId(targetChild);
      newUsedId.splice(0, newUsedId.length, ...newUsedId.filter((id) => !idsToDelete.includes(id)));
      changedCodeFlows = refreshCodeFlow(accCodeFlow.objects, toAddObject);
    } else {
      changedCodeFlows = updateCodeFlow(accCodeFlow.objects, toAddObject);
    }
  } else {
    // 새 항목 추가
    newUsedId.push(toAddObject.id!);
    if (toAddObject.depth > prevTrackingDepth) {
      changedCodeFlows = insertIntoDepth(accCodeFlow.objects, toAddObject, prevTrackingId);
    } else if (toAddObject.depth === prevTrackingDepth) {
      changedCodeFlows = insertEqualToDepth(accCodeFlow.objects, toAddObject, prevTrackingId);
    } else {
      changedCodeFlows = addCodeFlow(accCodeFlow.objects, toAddObject);
    }
  }

  newActivate = updateActivate(newActivate, toAddObject);
  const finallyCodeFlow = LightCodeFlow(changedCodeFlows, newActivate);

  // Tracking 정보 업데이트
  let newTrackingId = prevTrackingId;
  let newTrackingDepth = prevTrackingDepth;
  if (
    toAddObject.type !== "variable" &&
    toAddObject.type !== "list" &&
    toAddObject.type !== "tuple" &&
    toAddObject.type !== "input"
  ) {
    newTrackingDepth = (preprocessedCode as ForDto | PrintDto | IfElseChangeDto | CodeFlowVariableDto | WhileDto).depth;
    newTrackingId = (preprocessedCode as ForDto | PrintDto | IfElseChangeDto | CodeFlowVariableDto | WhileDto).id;
  }

  return {
    accCodeFlow: { objects: finallyCodeFlow },
    usedId: newUsedId,
    activate: newActivate,
    arrowText: (preprocessedCode as ForDto | PrintDto | IfElseChangeDto | CodeFlowVariableDto).code,
    highlightId: (preprocessedCode as ForDto | PrintDto | IfElseChangeDto | CodeFlowVariableDto).id,
    consoleLog,
    newTrackingId,
    newTrackingDepth,
  };
};

