import { ReactNode } from "react";
import styles from "./ElseBox.module.css";
import cx from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import { ConditionItem } from "@/pages/Home/types/conditionItem";
type Props = {
  children?: ReactNode;
  isLight: boolean;
  elseItem: ConditionItem;
};
function ElseBox({ children, isLight, elseItem }: Props) {
  return (
    <AnimatePresence key={elseItem.id}>
      <motion.div
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={cx("code-flow", isLight && "highlight-border")}
      >
        <motion.div
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={cx("code-flow-title-wrap")}
        >
          <motion.div layout className="code-flow-title">
            <motion.span layout>else</motion.span>
          </motion.div>
<<<<<<< HEAD
=======
          {isLight && elseItem.expr === "True" ? (
            <motion.div layout className={cx(styles.else_expr, isLight && styles.highlight)}>
              <span>True</span>
            </motion.div>
          ) : null}
>>>>>>> origin/develop

          <div className="code-flow-var">
            <div>
              {isLight && elseItem.expr === "True" ? (
                <motion.span layout className={cx(isLight && "highlight-number")}>
                  True
                </motion.span>
              ) : null}
            </div>
          </div>
        </motion.div>
        {children && <div>{children}</div>}
      </motion.div>
    </AnimatePresence>
  );
}

export default ElseBox;
