import { WrapperDataStructureItem } from "@/pages/Visualization/types/dataStructuresItem/wrapperDataStructureItem";
import { VariablesDto } from "@/pages/Visualization/types/dto/variablesDto";
import { AppendDto } from "@/pages/Visualization/types/dto/appendDto";
import { CreateCallStackDto } from "@/pages/Visualization/types/dto/createCallStackDto";
import { unLightCodeFlow } from "../../services/unLightCodeFlow";
import { State } from "../../types";

export const resetDataStructuresLight = (accDataStructures: WrapperDataStructureItem): WrapperDataStructureItem => {
  return Object.entries(accDataStructures).reduce((acc, [key, value]) => {
    acc[key] = {
      data: value.data.map((structure) => ({
        ...structure,
      })),
      isLight: false,
    };
    return acc;
  }, {} as WrapperDataStructureItem);
};

export const calculateToLightStructures = (
  preprocessedCode: any,
  accCodeFlow: State
): { toLightStructures: Record<string, string[]>; accCodeFlow: State } => {
  const toLightStructures: Record<string, string[]> = {};
  let newAccCodeFlow = accCodeFlow;

  if (preprocessedCode.type.toLowerCase() === "assign") {
    const code = preprocessedCode as VariablesDto;
    code.variables?.forEach((element) => {
      const callStackName = code.callStackName;
      if (!toLightStructures[callStackName]) {
        toLightStructures[callStackName] = [];
      }
      toLightStructures[callStackName].push(element.name);
    });
  } else if (preprocessedCode.type.toLowerCase() === "append") {
    const code = preprocessedCode as AppendDto;
    const variable = code.variable;
    if (variable.type.toLowerCase() === "variable") {
      toLightStructures[code.callStackName] = [variable.name];
    }
  } else if (preprocessedCode.type.toLowerCase() === "createCallStack") {
    const code = preprocessedCode as CreateCallStackDto;
    code.args?.forEach((element) => {
      const callStackName = code.callStackName;
      if (!toLightStructures[callStackName]) {
        toLightStructures[callStackName] = [];
      }
      toLightStructures[callStackName].push(element.name);
    });
    const unLightaccCodeFlow = unLightCodeFlow(accCodeFlow.objects);
    newAccCodeFlow = { objects: unLightaccCodeFlow };
  }

  return { toLightStructures, accCodeFlow: newAccCodeFlow };
};

export const applyLightToStructures = (
  accDataStructures: WrapperDataStructureItem,
  toLightStructures: Record<string, string[]>
): WrapperDataStructureItem => {
  return Object.entries(accDataStructures).reduce((acc, [key, value]) => {
    acc[key] = {
      data: value.data.map((structure) => ({
        ...structure,
        isLight: toLightStructures[key]?.includes(structure.name) ?? false,
      })),
      isLight: value.isLight,
    };
    return acc;
  }, {} as WrapperDataStructureItem);
};
