import { useRef, useEffect, ReactNode } from "react";
import { AllObjectItem } from "@/pages/Visualization/types/codeFlow/allObjectItem";
import { AnimatePresence, motion } from "framer-motion";
import { ReactElement } from "react";
import PrintBox from "./components/PrintBox/PrintBox";
import ForBox from "./components/ForBox/ForBox";
import IfBox from "./components/IfBox/IfBox";
import ElseBox from "./components/ElseBox/ElseBox";
import ElifBox from "./components/ElifBox/ElifBox";
import CodeFlowVariableBox from "./components/CodeFlowVariableBox/CodeFlowVariableBox";
import CodeFlowListWrapper from "./components/CodeFlowListWrapper/CodeFlowListWrapper";
import WhileBox from "./components/WhileBox/WhileBox";
import CallUserFuncBox from "./components/CallUserFuncBox/CallUserFuncBox";
// type import
import { ElseItem } from "@/pages/Visualization/types/codeFlow/elseItem";
import { ForItem } from "@/pages/Visualization/types/codeFlow/forItem";
import { PrintItem } from "@/pages/Visualization/types/codeFlow/printItem";
import { ConditionItem } from "@/pages/Visualization/types/codeFlow/conditionItem";
import { CodeFlowVariableItem } from "@/pages/Visualization/types/codeFlow/codeFlowVariableItem";
import { CodeFlowListItem } from "@/pages/Visualization/types/codeFlow/codeFlowListItem";
import { WhileItem } from "@/pages/Visualization/types/codeFlow/whileItem";
import { CallUserFuncItem } from "@/pages/Visualization/types/codeFlow/callUserFuncItem";
//zustand
import { useArrowStore } from "@/store/arrow";

interface Props {
  codeFlow: AllObjectItem;
  children?: ReactNode;
  width: number;
  height: number;
}
const CodeFlowItem = ({ codeFlow, width, height, children }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const setTop = useArrowStore((state) => state.setTop);
  const setRight = useArrowStore((state) => state.setRight);

  useEffect(() => {
    if (ref.current && codeFlow.isLight) {
      const rect = ref.current.getBoundingClientRect();
      setTop(rect.top);
      setRight(rect.right);
    }
  }, [codeFlow, ref, width, height]);

  return (
    <div style={{ width: "fit-content" }} ref={ref}>
      {children}
    </div>
  );
};

export const renderingCodeFlow = (codeFlows: AllObjectItem[], width: number, height: number): ReactElement => {
  return (
    <>
      {codeFlows.map((codeFlow, index) => {
        const type = codeFlow.type.toLowerCase();
        switch (type) {
          case "print": {
            const printItem = codeFlow as PrintItem;
            return (
              <CodeFlowItem key={printItem.id} codeFlow={codeFlow} width={width} height={height}>
                <PrintBox key={printItem.id} printItem={printItem} />
                {renderingCodeFlow(codeFlow.child, width, height)}
              </CodeFlowItem>
            );
          }
          case "for": {
            const forItem = codeFlow as ForItem;
            return (
              <div key={forItem.id}>
                <ForBox key={forItem.id} forItem={forItem} width={width} height={height}>
                  {renderingCodeFlow(codeFlow.child, width, height)}
                </ForBox>
              </div>
            );
          }
          case "if":
            const ifItem = codeFlow as ConditionItem;
            return (
              <AnimatePresence key={ifItem.id} mode="wait">
                <motion.div key={ifItem.id} layout>
                  <CodeFlowItem key={index} codeFlow={codeFlow} width={width} height={height}>
                    <IfBox isLight={codeFlow.isLight} ifItem={ifItem}>
                      {renderingCodeFlow(codeFlow.child, width, height)}
                    </IfBox>
                  </CodeFlowItem>
                </motion.div>
              </AnimatePresence>
            );
          case "elif":
            const elifItem = codeFlow as ConditionItem;
            return (
              <AnimatePresence key={elifItem.id} mode="wait">
                <motion.div key={elifItem.id} layout>
                  <CodeFlowItem key={index} codeFlow={codeFlow} width={width} height={height}>
                    <ElifBox isLight={codeFlow.isLight} elifItem={elifItem}>
                      {renderingCodeFlow(codeFlow.child, width, height)}
                    </ElifBox>
                  </CodeFlowItem>
                </motion.div>
              </AnimatePresence>
            );
          case "else":
            const elseItem = codeFlow as ElseItem;
            return (
              <AnimatePresence key={elseItem.id} mode="wait">
                <motion.div key={elseItem.id} layout>
                  <CodeFlowItem key={index} codeFlow={codeFlow} width={width} height={height}>
                    <ElseBox isLight={codeFlow.isLight} elseItem={elseItem}>
                      {renderingCodeFlow(codeFlow.child, width, height)}
                    </ElseBox>
                  </CodeFlowItem>
                </motion.div>
              </AnimatePresence>
            );
          case "variable":
            const variableItem = codeFlow as CodeFlowVariableItem;
            return (
              <div key={variableItem.id}>
                <CodeFlowVariableBox
                  key={variableItem.id}
                  codeFlowVariableItem={variableItem}
                  width={width}
                  height={height}
                />
              </div>
            );
          case "list":
            const listItem = codeFlow as CodeFlowListItem;
            return (
              <div key={listItem.id} style={{ width: "fit-content" }}>
                <CodeFlowListWrapper codeFlowListItem={listItem} />
              </div>
            );
          case "while":
            const whileItem = codeFlow as WhileItem;
            return (
              <div key={whileItem.id}>
                <CodeFlowItem key={index} codeFlow={codeFlow} width={width} height={height}>
                  <WhileBox key={index} whileItem={whileItem}>
                    {renderingCodeFlow(codeFlow.child, width, height)}
                  </WhileBox>
                </CodeFlowItem>
              </div>
            );
          case "calluserfunc":
            const callUserFuncItem = codeFlow as CallUserFuncItem;
            return (
              <div key={callUserFuncItem.id}>
                <CallUserFuncBox key={index} callUserFuncItem={callUserFuncItem}>
                  {renderingCodeFlow(codeFlow.child, width, height)}
                </CallUserFuncBox>
              </div>
            );
          default:
            throw new Error(`${codeFlow.type} is unexpected type`);
        }
      })}
    </>
  );
};
