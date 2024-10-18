import styles from "./DefFunctionDataStructure.module.css";
import { DataStructureFunctionItem } from "@/pages/Visualization/types/dataStructuresItem/dataStructureFunctionItem";

type Props = {
  functionItem: DataStructureFunctionItem;
};
const DefFunctionDataStructure = ({ functionItem }: Props) => {
  const { expr, isLight } = functionItem;

  return (

      <div className={styles["container"]}>
          <div className={styles["left-container"]}>
              <span className={styles["def"]}>def</span>
              <img src="/image/img_function_arrow.svg"  style={{ width: "30px" }}/>
          </div>
          <div className={styles["right-container"]}>
              <span className={styles["func"]}>func</span>
              <div className={styles["func-data"]}>
                  <span>{expr}</span>
              </div>
          </div>
      </div>
    </div>
  );
};

export default DefFunctionDataStructure;
