import { WrapperDataStructureItem } from "@/pages/Visualization/types/dataStructuresItem/wrapperDataStructureItem";
import { VariablesDto } from "@/pages/Visualization/types/dto/variablesDto";
import { AppendDto } from "@/pages/Visualization/types/dto/appendDto";
import { CreateCallStackDto } from "@/pages/Visualization/types/dto/createCallStackDto";
import { ValidTypeDto } from "@/pages/Visualization/types/dto/ValidTypeDto";
import { unLightCodeFlow } from "../../services/unLightCodeFlow";
import { State } from "../../types";

export const resetDataStructuresLight = (accDataStructures: WrapperDataStructureItem): WrapperDataStructureItem => {
  return Object.entries(accDataStructures).reduce((acc, [key, value]) => {
    acc[key] = {
      data: value.data,
      isLight: false,
    };
    return acc;
  }, {} as WrapperDataStructureItem);
};

const initializeLightStructure = (toLightStructures: Record<string, string[]>, callStackName: string): void => {
  if (!toLightStructures[callStackName]) {
    toLightStructures[callStackName] = [];
  }
};

export const calculateToLightStructures = (
  preprocessedCode: ValidTypeDto,
  accCodeFlow: State
): { toLightStructures: Record<string, string[]>; accCodeFlow: State } => {
  const toLightStructures: Record<string, string[]> = {};
  let newAccCodeFlow = accCodeFlow;
  const codeType = preprocessedCode.type.toLowerCase();

  if (codeType === "assign") {
    const code = preprocessedCode as VariablesDto;
    code.variables?.forEach((element) => {
      initializeLightStructure(toLightStructures, code.callStackName);
      toLightStructures[code.callStackName].push(element.name);
    });
  } else if (codeType === "append") {
    const code = preprocessedCode as AppendDto;
    const variable = code.variable;
    if (variable.type.toLowerCase() === "variable") {
      toLightStructures[code.callStackName] = [variable.name];
    }
  } else if (codeType === "createcallstack") {
    const code = preprocessedCode as CreateCallStackDto;
    code.args?.forEach((element) => {
      initializeLightStructure(toLightStructures, code.callStackName);
      toLightStructures[code.callStackName].push(element.name);
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
