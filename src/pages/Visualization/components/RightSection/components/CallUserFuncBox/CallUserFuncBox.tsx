import { ReactNode } from "react";
import { AnimatePresence } from "framer-motion";
import styles from "./CallUserFuncBox.module.css";
import { CallUserFuncItem } from "@/pages/Visualization/types/codeFlow/callUserFuncItem";
import cx from "classnames";
interface CallUserFuncProps {
  callUserFuncItem: CallUserFuncItem;
  children?: ReactNode;
}

const CallUserFuncBox = ({ callUserFuncItem, children }: CallUserFuncProps): ReactNode => {
  const { expr, returnValName, signature } = callUserFuncItem;
  return (
    <AnimatePresence>
      <div>
        <div className={styles["return-val"]}>
          <span>result</span>
          <div className={cx(styles["var-data"])}>
            <div className={styles["box"]}></div>
          </div>
        </div>
      </div>
      <div>
        <img className={styles["func-arrow"]} src="/image/img_func_arrow.svg" alt="방향이미지" />
      </div>
      <div className={styles["func-box"]}>
        <div className={styles["func-box-content"]}>
          <div className={styles["func-box-content-text"]}>{signature}</div>
        </div>
        <div className={styles["func-box-children"]}>
          함수 안에 코드흐름 들어갈 부분{children && <div>{children}</div>}
        </div>
      </div>
    </AnimatePresence>
  );
};

export default CallUserFuncBox;
