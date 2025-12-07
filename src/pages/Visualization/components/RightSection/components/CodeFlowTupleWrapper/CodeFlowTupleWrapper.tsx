import { useRef, useEffect, ReactNode } from "react";
import cx from "classnames";
import styles from "./CodeFlowTupleWrapper.module.css";
//components
import CodeFlowTupleBlock from "./components/CodeFlowTupleBlock";
//type
import { CodeFlowTupleItem } from "@/pages/Visualization/types/codeFlow/codeFlowTupleItem";
//zustand
import { useArrowStore } from "@/store/arrow";

import { useVisualizationContext } from "@/pages/Visualization/context/VisualizationContext";

interface CodeFlowWrapperItemProps {
  codeFlowWrapperItem: CodeFlowTupleItem;
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
  codeFlowTupleItem: CodeFlowTupleItem;
};

function CodeFlowTupleWrapper({ codeFlowTupleItem }: Props) {
  const { expr, isLight } = codeFlowTupleItem;
  const exprArray = expr?.slice(1, -1).split(",");

  return (
    <div className={cx("align-left", styles["fit-content"])}>
      <GetCodeFlowWrapperBoxLocation key={codeFlowTupleItem.id} codeFlowWrapperItem={codeFlowTupleItem}>
        <div className={styles.wrapper}>
          <div className={styles["direction-column"]}>
            <img src="/image/img_lock.png" alt="자물쇠" className={styles["tuple-lock"]}></img>
            <div style={{ display: "flex" }}>
              {exprArray?.map((exprItem, index) => {
                return <CodeFlowTupleBlock key={index} exprItem={exprItem} isLight={isLight} index={index} />;
              })}
            </div>
          </div>
        </div>
      </GetCodeFlowWrapperBoxLocation>
    </div>
  );
}

export default CodeFlowTupleWrapper;
