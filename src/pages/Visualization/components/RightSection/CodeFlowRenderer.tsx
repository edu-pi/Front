import { memo } from "react";
import { ReactElement } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Components
import PrintBox from "./components/PrintBox/PrintBox";
import ForBox from "./components/ForBox/ForBox";
import IfBox from "./components/IfBox/IfBox";
import ElseBox from "./components/ElseBox/ElseBox";
import ElifBox from "./components/ElifBox/ElifBox";
import CodeFlowVariableBox from "./components/CodeFlowVariableBox/CodeFlowVariableBox";
import CodeFlowListWrapper from "./components/CodeFlowListWrapper/CodeFlowListWrapper";
import CodeFlowTupleWrapper from "./components/CodeFlowTupleWrapper/CodeFlowTupleWrapper";
import WhileBox from "./components/WhileBox/WhileBox";
import CallUserFuncBox from "./components/CallUserFuncBox/CallUserFuncBox";
import ReturnBox from "./components/ReturnBox/ReturnBox";
import FlowControlBox from "./components/FlowControlBox/FlowControlBox";
import InputBox from "./components/InputBox/InputBox";
import CodeFlowItem from "./components/CodeFlowItem";

// Types
import { CodeFlowItem as CodeFlowItemType } from "./types";
import { PrintItem } from "@/pages/Visualization/types/codeFlow/printItem";
import { ForItem } from "@/pages/Visualization/types/codeFlow/forItem";
import { ConditionItem } from "@/pages/Visualization/types/codeFlow/conditionItem";
import { ElseItem } from "@/pages/Visualization/types/codeFlow/elseItem";
import { CodeFlowVariableItem } from "@/pages/Visualization/types/codeFlow/codeFlowVariableItem";
import { CodeFlowListItem } from "@/pages/Visualization/types/codeFlow/codeFlowListItem";
import { CodeFlowTupleItem } from "@/pages/Visualization/types/codeFlow/codeFlowTupleItem";
import { WhileItem } from "@/pages/Visualization/types/codeFlow/whileItem";
import { CallUserFuncItem } from "@/pages/Visualization/types/codeFlow/callUserFuncItem";
import { ReturnItem } from "@/pages/Visualization/types/codeFlow/returnItem";
import { FlowControlItem } from "@/pages/Visualization/types/codeFlow/flowControlItem";
import { InputItem } from "@/pages/Visualization/types/codeFlow/inputItem";

interface CodeFlowRendererProps {
  codeFlows: CodeFlowItemType[];
}

const CodeFlowRenderer = memo(({ codeFlows }: CodeFlowRendererProps): ReactElement => {
  return (
    <>
      {codeFlows.map((codeFlow, index) => {
        const type = codeFlow.type.toLowerCase();
        switch (type) {
          case "print": {
            const printItem = codeFlow as PrintItem;
            return (
              <CodeFlowItem key={printItem.id} codeFlow={codeFlow}>
                <PrintBox key={printItem.id} printItem={printItem} />
                <CodeFlowRenderer codeFlows={codeFlow.child} />
              </CodeFlowItem>
            );
          }
          case "for": {
            const forItem = codeFlow as ForItem;
            return (
              <div key={forItem.id}>
                <ForBox key={forItem.id} forItem={forItem}>
                  <CodeFlowRenderer codeFlows={codeFlow.child} />
                </ForBox>
              </div>
            );
          }
          case "if":
            const ifItem = codeFlow as ConditionItem;
            return (
              <AnimatePresence key={ifItem.id} mode="wait">
                <motion.div key={ifItem.id} layout>
                  <CodeFlowItem key={index} codeFlow={codeFlow}>
                    <IfBox isLight={codeFlow.isLight} ifItem={ifItem}>
                      <CodeFlowRenderer codeFlows={codeFlow.child} />
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
                  <CodeFlowItem key={index} codeFlow={codeFlow}>
                    <ElifBox isLight={codeFlow.isLight} elifItem={elifItem}>
                      <CodeFlowRenderer codeFlows={codeFlow.child} />
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
                  <CodeFlowItem key={index} codeFlow={codeFlow}>
                    <ElseBox isLight={codeFlow.isLight} elseItem={elseItem}>
                      <CodeFlowRenderer codeFlows={codeFlow.child} />
                    </ElseBox>
                  </CodeFlowItem>
                </motion.div>
              </AnimatePresence>
            );
          case "variable":
            const variableItem = codeFlow as CodeFlowVariableItem;
            return (
              <CodeFlowItem key={variableItem.id} codeFlow={codeFlow}>
                <CodeFlowVariableBox key={variableItem.id} codeFlowVariableItem={variableItem} />
              </CodeFlowItem>
            );
          case "list":
            const listItem = codeFlow as CodeFlowListItem;
            return (
              <CodeFlowItem key={listItem.id} codeFlow={codeFlow}>
                <CodeFlowListWrapper codeFlowListItem={listItem} />
              </CodeFlowItem>
            );
          case "tuple":
            const tupleItem = codeFlow as CodeFlowTupleItem;
            return (
              <CodeFlowItem key={tupleItem.id} codeFlow={codeFlow}>
                <CodeFlowTupleWrapper codeFlowTupleItem={tupleItem} />
              </CodeFlowItem>
            );
          case "while":
            const whileItem = codeFlow as WhileItem;
            return (
              <div key={whileItem.id}>
                <CodeFlowItem key={index} codeFlow={codeFlow}>
                  <WhileBox key={index} whileItem={whileItem}>
                    <CodeFlowRenderer codeFlows={codeFlow.child} />
                  </WhileBox>
                </CodeFlowItem>
              </div>
            );
          case "calluserfunc":
            const callUserFuncItem = codeFlow as CallUserFuncItem;
            return (
              <div key={callUserFuncItem.id}>
                <CodeFlowItem key={index} codeFlow={codeFlow}>
                  <CallUserFuncBox key={index} callUserFuncItem={callUserFuncItem}>
                    <CodeFlowRenderer codeFlows={codeFlow.child} />
                  </CallUserFuncBox>
                </CodeFlowItem>
              </div>
            );
          case "return":
            const returnItem = codeFlow as ReturnItem;
            return (
              <div key={returnItem.id}>
                <CodeFlowItem key={index} codeFlow={codeFlow}>
                  <ReturnBox key={index} returnItem={returnItem} />
                </CodeFlowItem>
              </div>
            );
          case "flowcontrol":
            const flowControlItem = codeFlow as FlowControlItem;
            return (
              <div key={flowControlItem.id}>
                <CodeFlowItem key={index} codeFlow={codeFlow}>
                  <FlowControlBox key={index} flowControlItem={flowControlItem} />
                </CodeFlowItem>
              </div>
            );
          case "input":
            const inputItem = codeFlow as InputItem;
            return (
              <div key={inputItem.id}>
                <CodeFlowItem key={index} codeFlow={codeFlow}>
                  <InputBox key={inputItem.id} InputItem={inputItem} />
                </CodeFlowItem>
              </div>
            );

          default:
            throw new Error(`${codeFlow.type} is unexpected type`);
        }
      })}
    </>
  );
});

export default CodeFlowRenderer;
