import styles from "./ReturnBox.module.css";

import { ReturnItem } from "@/pages/Visualization/types/codeFlow/returnItem";
interface Props {
  returnItem: ReturnItem;
}
function ReturnBox({ returnItem }: Props) {
  const { returnName, returnValue } = returnItem;
  return (
    <div>
      <span>Return</span>
      <div className={styles["return-data"]}>
        <span>{returnValue}</span>
      </div>
    </div>
  );
}

export default ReturnBox;
