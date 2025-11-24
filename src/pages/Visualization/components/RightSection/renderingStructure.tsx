import { ReactNode, useRef } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { ReactElement } from "react";
//components
import VariableBox from "./components/VariableBox/VariableBox";
import ListWrapper from "./components/ListWrapper/ListWrapper";
import TupleWrapper from "./components/TupleWrapper/TupleWrapper";
import DefFunctionDataStructure from "./components/DefFunctionDataStructure/DefFunctionDataStructure";

//type
import { DataStructureVarsItem } from "@/pages/Visualization/types/dataStructuresItem/dataStructureVarsItem";
import { DataStructureListItem } from "@/pages/Visualization/types/dataStructuresItem/dataStructureListItem";
import { DataStructureTupleItem } from "@/pages/Visualization/types/dataStructuresItem/dataStructureTupleItem";
import { WrapperDataStructureItem, StructureValue } from "../../types/dataStructuresItem/wrapperDataStructureItem";
import { DataStructureFunctionItem } from "@/pages/Visualization/types/dataStructuresItem/dataStructureFunctionItem";
//zustand

interface Props {
  children?: ReactNode;
  structure: DataStructureListItem | DataStructureVarsItem | WrapperDataStructureItem;
}

interface CallstackProps {
  children?: ReactNode;
  structure: StructureValue;
}

const StructureItem = ({ children, structure }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div ref={ref} style={{ width: "fit-content" }} id={structure.isLight ? "highlighted-structure-item" : undefined}>
      {children}
    </div>
  );
};
const CallstackItem = ({ children }: CallstackProps) => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div ref={ref} style={{ width: "fit-content" }}>
      {children}
    </div>
  );
};

export const renderingStructure = (
  structures: WrapperDataStructureItem //변수시각화 리스트
): ReactElement => {
  return (
    <>
      {Object.keys(structures).map((key, index) => {
        return (
          <div key={index}>
            <CallstackItem structure={structures[key]}>
              <div className="var-data-wrap">
                <div className="var-title">
                  <p>{key}</p>
                </div>
                <div className="call-stack-box">
                  {structures[key].data.map((structure) => {
                    switch (structure.type) {
                      case "variable": {
                        const variableItem = structure as DataStructureVarsItem;
                        return (
                          <AnimatePresence key={variableItem.name + key} mode="wait">
                            <motion.ul
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="var-list"
                              style={{ display: "inline-block" }}
                            >
                              <StructureItem structure={variableItem}>
                                <VariableBox
                                  value={variableItem.expr}
                                  name={variableItem.name}
                                  isLight={variableItem.isLight}
                                />
                              </StructureItem>
                            </motion.ul>
                          </AnimatePresence>
                        );
                      }
                      case "list": {
                        const listItem = structure as DataStructureListItem;
                        return (
                          <AnimatePresence key={listItem.name + key} mode="wait">
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              style={{ display: "inline-block" }}
                            >
                              <StructureItem structure={listItem}>
                                <ListWrapper listItem={listItem} />
                              </StructureItem>
                            </motion.div>
                          </AnimatePresence>
                        );
                      }
                      case "tuple": {
                        const tupleItem = structure as DataStructureTupleItem;
                        return (
                          <AnimatePresence key={tupleItem.name + key} mode="wait">
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              style={{ display: "inline-block" }}
                            >
                              <StructureItem structure={tupleItem}>
                                <TupleWrapper listItem={tupleItem} />
                              </StructureItem>
                            </motion.div>
                          </AnimatePresence>
                        );
                      }
                      case "function": {
                        const functionItem = structure as DataStructureFunctionItem;
                        return (
                          <AnimatePresence key={functionItem.name + key} mode="wait">
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              style={{ display: "inline-block" }}
                            >
                              <StructureItem structure={functionItem}>
                                <DefFunctionDataStructure functionItem={functionItem} />
                              </StructureItem>
                            </motion.div>
                          </AnimatePresence>
                        );
                      }
                      default: {
                        return null; // 다른 타입의 경우 아무것도 렌더링하지 않음
                      }
                    }
                  })}
                </div>
              </div>
            </CallstackItem>
          </div>
        );
      })}
    </>
  );
};
