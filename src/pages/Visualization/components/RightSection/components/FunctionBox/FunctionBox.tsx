import { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./FunctionBox.module.css";

import cx from "classnames";
type Props = {
  isLight: boolean;
  expr: string;
  returnValName: string;
};

const FunctionBox = ({ isLight, expr }: Props): ReactNode => {
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
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <img className={styles["func-arrow"]} src="/image/img_func_arrow.svg" alt="방향이미지" />
      </motion.div>
      <div className={styles["func-box"]}>
        <div className={styles["func-box-content"]}>
          <div className={styles["func-box-content-text"]}>isEven(22)</div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default FunctionBox;
