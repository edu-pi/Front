import { useRef, useEffect, ReactNode } from "react";
import cx from "classnames";
import styles from "./CodeFlowListWrapper.module.css";
//components
import CodeFlowListBlock from "./components/CodeFlowListBlock";
//type
import { CodeFlowListItem } from "@/pages/Visualization/types/codeFlow/codeFlowListItem";
//zustand
import { useArrowStore } from "@/store/arrow";
import { useVisualizationContext } from "@/pages/Visualization/context/VisualizationContext";

interface CodeFlowWrapperItemProps {
  codeFlowWrapperItem: CodeFlowListItem;
  children?: ReactNode;
}
const GetCodeFlowWrapperBoxLocation = ({ codeFlowWrapperItem, children }: CodeFlowWrapperItemProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const setTop = useArrowStore((state) => state.setTop);
  const setRight = useArrowStore((state) => state.setRight);
  const { width, height } = useVisualizationContext();

  useEffect(() => {
    if (ref.current && codeFlowWrapperItem.isLight) {
      const rect = ref.current.getBoundingClientRect();
      setTop(rect.top - 40);
      setRight(rect.right + 10);
    }
  }, [codeFlowWrapperItem, height, width]);

  return (
    <div className="useRef" ref={ref}>
      {children}
    </div>
  );
};
type Props = {
  codeFlowListItem: CodeFlowListItem;
};
function CodeFlowListWrapper({ codeFlowListItem }: Props) {
  let { expr, isLight } = codeFlowListItem;
  if (expr?.startsWith("[") && expr?.endsWith("]")) {
    expr = expr?.slice(1, -1);
  }
  const exprArray = expr.split(",");

  return (
    <div className={cx("align-left", styles["fit-content"])}>
      <GetCodeFlowWrapperBoxLocation key={codeFlowListItem.id} codeFlowWrapperItem={codeFlowListItem}>
        <div className={styles.wrapper}>
          {exprArray?.map((exprItem, index) => {
            return <CodeFlowListBlock key={index} exprItem={exprItem} isLight={isLight} index={index} />;
          })}
        </div>
      </GetCodeFlowWrapperBoxLocation>
    </div>
  );
}

export default CodeFlowListWrapper;
