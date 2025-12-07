import { useRef, useEffect, ReactNode } from "react";
import styles from "./ForBox.module.css";
import cx from "classnames";
import { AnimatePresence, motion } from "framer-motion";

//type
import { ForItem } from "@/pages/Visualization/types/codeFlow/forItem";
//zustand
import { useArrowStore } from "@/store/arrow";
import { useVisualizationContext } from "@/pages/Visualization/context/VisualizationContext";

interface ForItemProps {
  forItem: ForItem;
  children?: ReactNode;
}
const GetForBoxLocation = ({ forItem, children }: ForItemProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const setTop = useArrowStore((state) => state.setTop);
  const setRight = useArrowStore((state) => state.setRight);
  const { width, height } = useVisualizationContext();

  useEffect(() => {
    if (ref.current && forItem.isLight) {
      const rect = ref.current.getBoundingClientRect();
      setTop(rect.top + 20);
      setRight(rect.right);
    }
  }, [forItem, width, height]);

  return (
    <div className="useRef" ref={ref} style={{ width: "fit-content" }}>
      {children}
    </div>
  );
};
type Props = {
  children: ReactNode;
  forItem: ForItem;
};

const ForBox = ({ children, forItem }: Props) => {
  return (
    <AnimatePresence key={forItem.id}>
      <GetForBoxLocation key={forItem.id} forItem={forItem}>
        <motion.div
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={cx("code-flow", "code-flow-for", forItem.isLight && "highlight-border")}
        >
          <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={cx("code-flow-title-wrap", forItem.isLight && styles.highlight)}
          >
            <motion.div className="code-flow-title">
              <span>for</span>
            </motion.div>

            <motion.div className="code-flow-var">
              <motion.div>
                <span className="code-var-title">{forItem.target}</span>
                <span className={cx(forItem.isLight && forItem.isCurLight && "highlight-number")}>{forItem.cur}</span>
              </motion.div>
              <motion.div>
                <span className="code-var-title">start</span>
                <span className={cx(forItem.isLight && forItem.isStartLight && "highlight-number")}>
                  {forItem.start}
                </span>
              </motion.div>
              <motion.div>
                <span className="code-var-title">end</span>
                <span className={cx(forItem.isLight && forItem.isEndLight && "highlight-number")}>{forItem.end}</span>
              </motion.div>
              {forItem.step === "1" ? null : (
                <motion.div>
                  <span className="code-var-title">step</span>
                  <span className={cx(forItem.isLight && forItem.isStepLight && styles["highlight-number"])}>
                    {forItem.step}
                  </span>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
          {children && <div>{children}</div>}
        </motion.div>
      </GetForBoxLocation>
    </AnimatePresence>
  );
};

export default ForBox;
