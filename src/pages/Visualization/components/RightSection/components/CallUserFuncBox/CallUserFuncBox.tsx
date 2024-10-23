import { ReactNode } from "react";

import styles from "./CallUserFuncBox.module.css";
import { CallUserFuncItem } from "@/pages/Visualization/types/codeFlow/callUserFuncItem";
import cx from "classnames";
interface CallUserFuncProps {
  callUserFuncItem: CallUserFuncItem;
  children?: ReactNode;
}

const CallUserFuncBox = ({ callUserFuncItem, children }: CallUserFuncProps): ReactNode => {
  const { signature, assignName, isLight } = callUserFuncItem;

  return (
    <>
      {assignName == "" ? null : (
        <>
          <div>
            <div className={styles["return-val"]}>
              <span>{assignName}</span>
              <div className={cx(styles["var-data"], isLight && styles.highlight)}>
                <div className={styles["box"]}></div>
              </div>
            </div>
          </div>
          <div>
            <img className={styles["func-arrow"]} src="/image/img_func_arrow.svg" alt="방향이미지" />
          </div>
        </>
      )}

      <div className={styles["func-box"]}>
        <div className={styles["func-box-content"]}>
          <div className={styles["func-box-content-text"]}>{signature}</div>
        </div>
        <div className={styles["func-box-children"]}>{children && <div>{children}</div>}</div>
      </div>
    </>
  );
};

export default CallUserFuncBox;
