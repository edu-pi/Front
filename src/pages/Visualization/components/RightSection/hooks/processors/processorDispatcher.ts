import { ProcessorContext, ProcessorResult, ProcessorFunction } from "./types";
import { processEndUserFunc } from "./processEndUserFunc";
import { processAppend } from "./processAppend";
import { processAssign } from "./processAssign";
import { processCreateCallStack } from "./processCreateCallStack";
import { processIfElseDefine } from "./processIfElseDefine";
import { processCodeFlow } from "./processCodeFlow";
import {
  EndUserFuncDto,
  AppendDto,
  VariablesDto,
  CreateCallStackDto,
  IfElseDto,
  ForDto,
  PrintDto,
  IfElseChangeDto,
  CodeFlowVariableDto,
  WhileDto,
} from "@/pages/Visualization/types/dto";

const endUserFuncWrapper: ProcessorFunction = (context) => {
  const result = processEndUserFunc({
    preprocessedCode: context.preprocessedCode as EndUserFuncDto,
    accCodeFlow: context.accCodeFlow,
    accDataStructures: context.accDataStructures,
    usedName: context.usedName,
    prevTrackingId: context.prevTrackingId,
    prevTrackingDepth: context.prevTrackingDepth,
  });
  return {
    accCodeFlow: result.accCodeFlow,
    accDataStructures: result.accDataStructures,
    usedName: result.usedName,
    arrowTexts: [result.arrowText],
    highlightIds: [result.highlightId],
    newTrackingId: result.newTrackingId,
    newTrackingDepth: result.newTrackingDepth,
  };
};

const appendWrapper: ProcessorFunction = (context) => {
  const result = processAppend({
    preprocessedCode: context.preprocessedCode as AppendDto,
    accCodeFlow: context.accCodeFlow,
    accDataStructures: context.accDataStructures,
    usedId: context.usedId,
  });
  return {
    accCodeFlow: result.accCodeFlow,
    accDataStructures: result.accDataStructures,
    usedId: result.usedId,
    arrowTexts: [result.arrowText],
    highlightIds: [result.highlightId],
  };
};

const assignWrapper: ProcessorFunction = (context) => {
  const result = processAssign({
    preprocessedCode: context.preprocessedCode as VariablesDto,
    accCodeFlow: context.accCodeFlow,
    accDataStructures: context.accDataStructures,
    usedName: context.usedName,
    usedId: context.usedId,
  });
  return {
    accCodeFlow: result.accCodeFlow,
    accDataStructures: result.accDataStructures,
    usedName: result.usedName,
    usedId: result.usedId,
    arrowTexts: result.arrowTexts,
    highlightIds: result.highlightIds,
  };
};

const createCallStackWrapper: ProcessorFunction = (context) => {
  const result = processCreateCallStack({
    preprocessedCode: context.preprocessedCode as CreateCallStackDto,
    accDataStructures: context.accDataStructures,
    usedName: context.usedName,
  });
  return {
    accDataStructures: result.accDataStructures,
    usedName: result.usedName,
    arrowTexts: [result.arrowText],
    highlightIds: [result.highlightId],
  };
};

const ifElseDefineWrapper: ProcessorFunction = (context) => {
  const result = processIfElseDefine({
    preprocessedCode: context.preprocessedCode as IfElseDto,
    accCodeFlow: context.accCodeFlow,
    usedId: context.usedId,
    prevTrackingId: context.prevTrackingId,
    prevTrackingDepth: context.prevTrackingDepth,
  });
  return {
    accCodeFlow: result.accCodeFlow,
    usedId: result.usedId,
    arrowTexts: [result.arrowText],
    highlightIds: [result.highlightId],
    newTrackingId: result.newTrackingId,
    newTrackingDepth: result.newTrackingDepth,
  };
};

const codeFlowWrapper: ProcessorFunction = (context) => {
  const result = processCodeFlow({
    preprocessedCode: context.preprocessedCode as ForDto | PrintDto | IfElseChangeDto | CodeFlowVariableDto | WhileDto,
    accCodeFlow: context.accCodeFlow,
    usedId: context.usedId,
    activate: context.activate,
    prevTrackingId: context.prevTrackingId,
    prevTrackingDepth: context.prevTrackingDepth,
  });
  return {
    accCodeFlow: result.accCodeFlow,
    usedId: result.usedId,
    activate: result.activate,
    arrowTexts: [result.arrowText],
    highlightIds: [result.highlightId],
    consoleLog: result.consoleLog,
    newTrackingId: result.newTrackingId,
    newTrackingDepth: result.newTrackingDepth,
  };
};

const processorMap: Record<string, ProcessorFunction> = {
  enduserfunc: endUserFuncWrapper,
  append: appendWrapper,
  assign: assignWrapper,
  createcallstack: createCallStackWrapper,
  ifelsedefine: ifElseDefineWrapper,
};

export const dispatchProcessor = (codeType: string, context: ProcessorContext): ProcessorResult => {
  const processor = processorMap[codeType] || codeFlowWrapper;
  return processor(context);
};
