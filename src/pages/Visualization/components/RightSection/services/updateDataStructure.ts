import { WarperDataStructureItem } from "@/pages/Visualization/types/dataStructuresItem/warperDataStructureItem";
import { VariableDto } from "@/pages/Visualization/types/dto/variableDto";
export const updateDataStructure = (
  targetName: string,
  dataStructures: WarperDataStructureItem,
  newData: VariableDto,
  callStack: string
): WarperDataStructureItem => {
  return {
    ...dataStructures,
    [callStack]: {
      ...dataStructures[callStack],
      data: dataStructures[callStack].data.map((dataStructure) => {
        return dataStructure.name === targetName ? { ...dataStructure, ...newData } : dataStructure;
      }),
    },
  };
};
