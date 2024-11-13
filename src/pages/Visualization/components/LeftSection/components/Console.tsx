import { useContext } from "react";
import { useConsoleStore } from "@/store/console";
import { InputErrorContext } from "@/pages/Visualization/context/InputErrorContext";
import cx from "classnames";
import styles from "./Console.module.css";

const Console = () => {
  const consoleText = useConsoleStore((state) => state.consoleList);
  const inputErrorContext = useContext(InputErrorContext);
  if (!inputErrorContext) {
    throw new Error("InputErrorContext not found");
  }
  const { isInputError, setIsInputError } = inputErrorContext;
  const stepIdx = useConsoleStore((state) => state.stepIdx);
  const { inputData, setInputData } = useConsoleStore();
  const handleConsoleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputData(e.target.value);

    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };
  const clickInput = () => {
    setIsInputError(false);
  };
  return (
    <div className={styles["view-section1-2"]}>
      Ò<p className={styles["view-section-title"]}>Console</p>
      <textarea
        className={cx(styles["input-area"], isInputError && styles["input-error"])}
        value={inputData}
        onChange={(e) => handleConsoleTextChange(e)}
        onClick={clickInput}
        placeholder="input을 입력해주세요."
      />
      <div className={styles["view-data"]}>
        <div className={styles.consoleText}>{consoleText[stepIdx]}</div>
      </div>
    </div>
  );
};

export default Console;
