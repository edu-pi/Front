import { useRef, useEffect, ReactNode } from "react";
import styles from "./CodeFlowVariableBox.module.css";
import cx from "classnames";

//type
import { CodeFlowVariableItem } from "@/pages/Visualization/types/codeFlow/codeFlowVariableItem";

//zustand
import { useArrowStore } from "@/store/arrow";
import { useVisualizationContext } from "@/pages/Visualization/context/VisualizationContext";

interface CodeFlowVariableItemProps {
  codeFlowVariableItem: CodeFlowVariableItem;
  children?: ReactNode;
}
const GetCodeFlowVariableBoxLocation = ({ codeFlowVariableItem, children }: CodeFlowVariableItemProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const setTop = useArrowStore((state) => state.setTop);
  const setRight = useArrowStore((state) => state.setRight);
  const { width, height } = useVisualizationContext();

  useEffect(() => {
    if (ref.current && codeFlowVariableItem.isLight) {
      const rect = ref.current.getBoundingClientRect();
      setTop(rect.top - 40);
      setRight(rect.right + 10);
    }
  }, [codeFlowVariableItem, height, width]);

  return (
    <div className="useRef" ref={ref}>
      {children}
    </div>
  );
};

type Props = {
  codeFlowVariableItem: CodeFlowVariableItem;
};
const CodeFlowVariableBox = ({ codeFlowVariableItem }: Props) => {
  const { id, isLight, name, expr } = codeFlowVariableItem;
  return (
    <div className="align-left">
      <div className={styles["align-center"]}>
        <span>{name}</span>
        <div className={cx(styles["var-data"], isLight && styles.highlight)}>
          <GetCodeFlowVariableBoxLocation key={id} codeFlowVariableItem={codeFlowVariableItem}>
            {expr ? <span className={styles.text}>{expr}</span> : null}
          </GetCodeFlowVariableBoxLocation>
        </div>
      </div>
    </div>
  );
};

export default CodeFlowVariableBox;
