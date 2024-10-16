import styles from "./DefFunctionDataStructure.module.css";
import { DataStructureFunctionItem } from "@/pages/Visualization/types/dataStructuresItem/dataStructureFunctionItem";
import cx from "classnames";
type Props = {
  functionItem: DataStructureFunctionItem;
};
const DefFunctionDataStructure = ({ functionItem }: Props) => {
  const { expr, isLight } = functionItem;

  return (
    <div>
      <span>def</span>
      <span style={{ margin: "10px" }}>func</span>
      <div className={cx(styles["func-data"], isLight && styles.highlight)}>
        <span>{expr}</span>
      </div>
    </div>
  );
};

export default DefFunctionDataStructure;
