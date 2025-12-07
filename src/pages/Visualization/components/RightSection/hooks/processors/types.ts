import { ActivateItem } from "@/pages/Visualization/types/activateItem";
import { WrapperDataStructureItem } from "@/pages/Visualization/types/dataStructuresItem/wrapperDataStructureItem";
import { usedNameObjectType } from "@/pages/Visualization/types/dataStructuresItem/usedNameObjectType";
import { State } from "../../types";
import { ValidTypeDto } from "@/pages/Visualization/types/dto/ValidTypeDto";

// Union type for all possible preprocessed code DTOs
export type PreprocessedCode = ValidTypeDto;

export interface ProcessorContext {
  preprocessedCode: PreprocessedCode;
  accCodeFlow: State;
  accDataStructures: WrapperDataStructureItem;
  usedName: usedNameObjectType;
  usedId: number[];
  activate: ActivateItem[];
  prevTrackingId: number;
  prevTrackingDepth: number;
}

export interface ProcessorResult {
  accCodeFlow?: State;
  accDataStructures?: WrapperDataStructureItem;
  usedName?: usedNameObjectType;
  usedId?: number[];
  activate?: ActivateItem[];
  arrowTexts: string[]; // Changed to array to support multiple texts (e.g. assign)
  highlightIds: number[]; // Changed to array
  consoleLog?: string;
  newTrackingId?: number;
  newTrackingDepth?: number;
}

export type ProcessorFunction = (context: ProcessorContext) => ProcessorResult;
