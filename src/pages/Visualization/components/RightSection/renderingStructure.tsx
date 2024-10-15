import { ReactNode, useEffect, useRef } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { ReactElement } from "react";
//components
import VariableBox from "./components/VariableBox/VariableBox";
import ListWrapper from "./components/ListWrapper/ListWrapper";
import DefFunctionDataStructure from "./components/DefFunctionDataStructure/DefFunctionDataStructure";

//type
import { DataStructureVarItem } from "@/pages/Visualization/types/dataStructuresItem/dataStructureVarsItem";
import { DataStructureListItem } from "@/pages/Visualization/types/dataStructuresItem/dataStructureListItem";
import { WarperDataStructureItem } from "../../types/dataStructuresItem/warperDataStructureItem";
import { DataStructureFunctionItem } from "@/pages/Visualization/types/dataStructuresItem/dataStructureFunctionItem";
//zustand
import { useArrowStore } from "@/store/arrow";

interface Props {
  children?: ReactNode;
  structure: DataStructureListItem | DataStructureVarItem;

  height: number;
  width: number;
}

const StructureItem = ({ children, structure, height, width }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const setTop = useArrowStore((state) => state.setTop);
  const setRight = useArrowStore((state) => state.setRight);

  useEffect(() => {
    if (ref.current && structure.isLight) {
      const rect = ref.current.getBoundingClientRect();

      setTop(rect.top);
      setRight(rect.right);
    }
  }, [structure, height, width]);

  return (
    <div ref={ref} style={{ width: "fit-content" }}>
      {children}
    </div>
  );
};

export const renderingStructure = (
  structures: WarperDataStructureItem, //변수시각화 리스트
  height: number,
  width: number
): ReactElement => {
  return (
    <>
      {Object.keys(structures).map((key, index) => {
        return (
          <div key={index}>
            <div className="call-stack-box">
              <span className="call-stack-name">{key}</span>
              {structures[key].map((structure, index) => {
                switch (structure.type) {
                  case "variable": {
                    const variableItem = structure as DataStructureVarItem;
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
                          <StructureItem structure={variableItem} height={height} width={width}>
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
                          <StructureItem structure={listItem} height={height} width={width}>
                            <ListWrapper listItem={listItem} />
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
                          <StructureItem structure={functionItem} height={height} width={width}>
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
        );
      })}
    </>
  );
};
