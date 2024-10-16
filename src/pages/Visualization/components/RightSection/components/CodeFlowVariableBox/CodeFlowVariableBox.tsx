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
  const { id, isLight, name, expr } = codeFlowVariableItem;
  return (
    <div className="align-left">
      <div className={styles["align-center"]}>
        <span>{name}</span>
        <div className={cx(styles["var-data"], isLight && styles.highlight)}>
          <GetCodeFlowVariableBoxLocation
            key={id}
            codeFlowVariableItem={codeFlowVariableItem}
            height={height}
            width={width}
          >
            <span className={styles.text}>{expr}</span>
          </GetCodeFlowVariableBoxLocation>
        </div>
      </div>
    </div>
  );
};

export default CodeFlowVariableBox;
