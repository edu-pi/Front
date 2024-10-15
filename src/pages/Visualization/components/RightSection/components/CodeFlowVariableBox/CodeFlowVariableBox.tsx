import { useRef, useEffect, ReactNode } from "react";
import styles from "./CodeFlowVariableBox.module.css";
import cx from "classnames";

//type
import { CodeFlowVariableItem } from "@/pages/Visualization/types/codeFlow/codeFlowVariableItem";

//zustand
import { useArrowStore } from "@/store/arrow";
interface CodeFlowVariableItemProps {
  codeFlowVariableItem: CodeFlowVariableItem;
  height: number;
  width: number;
  children?: ReactNode;
}
const GetCodeFlowVariableBoxLocation = ({
  codeFlowVariableItem,
  height,
  width,
  children,
}: CodeFlowVariableItemProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const setTop = useArrowStore((state) => state.setTop);
  const setRight = useArrowStore((state) => state.setRight);

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
  height: number;
  width: number;
};
const CodeFlowVariableBox = ({ codeFlowVariableItem, height, width }: Props) => {
  return (
    <div className="align-left">
      <div className={cx(styles["var-data"], codeFlowVariableItem.isLight && styles.highlight)}>
        <GetCodeFlowVariableBoxLocation
          key={codeFlowVariableItem.id}
          codeFlowVariableItem={codeFlowVariableItem}
          height={height}
          width={width}
        >
          <span className={styles.text}>{codeFlowVariableItem.expr}</span>
        </GetCodeFlowVariableBoxLocation>
      </div>
    </div>
  );
};

export default CodeFlowVariableBox;
