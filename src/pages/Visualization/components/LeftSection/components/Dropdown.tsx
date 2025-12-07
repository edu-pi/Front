import styles from "../LeftSection.module.css";
import { useEffect, useRef, useState, useContext } from "react";
import { CodeContext } from "@/pages/Visualization/context/CodeContext";
import { useConsoleStore } from "@/store/console";
import {
  data_codes,
  string_codes,
  operation_codes,
  control_codes,
  list_codes,
  repeat_codes,
  function_codes,
} from "./exampleCode.ts";
import { PreprocessedCodesContext } from "@/pages/Visualization/context/PreProcessedCodesContext.ts";

interface DropdownProps {
  isTutorialActive?: boolean;
}

const Dropdown = ({ isTutorialActive }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("커리큘럼");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const codeContext = useContext(CodeContext);
  if (!codeContext) {
    throw new Error("CodeContext not found");
  }
  const { setCode } = codeContext;
  // 외부 클릭 감지를 위한 useEffect
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };
  const { resetInputData, resetConsole } = useConsoleStore();
  const { setPreprocessedCodes } = useContext(PreprocessedCodesContext);

  const updateOption = (optionText: string, code: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedOption(optionText);
    setCode(code);
    resetInputData();
    resetConsole();
    setPreprocessedCodes([]);
    setIsOpen(false);
  };

  return (
    <div className={styles["select-box"]} ref={dropdownRef} style={isTutorialActive ? { zIndex: "unset" } : undefined}>
      <div
        className={`${styles["default-option"]} ${selectedOption !== "커리큘럼" ? styles["is_selected"] : ""}`}
        onClick={toggleDropdown}
      >
        <button id="selected-option">{selectedOption}</button>
        <img src="/image/icon_down_arrow.svg" alt="arrow" />
      </div>
      <ul className={styles["dropdown-menu"]} style={{ display: isOpen ? "block" : "none" }}>
        <li className={styles["main-option"]}>
          <p className={styles.step1}>자료형</p>
          <ul className={styles["sub-options"]}>
            {data_codes.map(([title, code], index) => (
              <li key={index}>
                <button onClick={(e) => updateOption(title, code, e)}>{title}</button>
              </li>
            ))}
          </ul>
        </li>
        <li className={styles["main-option"]}>
          <p className={styles.step1}>문자열 다루기</p>
          <ul className={styles["sub-options"]}>
            {string_codes.map(([title, code], index) => (
              <li key={index}>
                <button onClick={(e) => updateOption(title, code, e)}>{title}</button>
              </li>
            ))}
          </ul>
        </li>
        <li className={styles["main-option"]}>
          <p className={styles.step1}>연산자</p>
          <ul className={styles["sub-options"]}>
            {operation_codes.map(([title, code], index) => (
              <li key={index}>
                <button onClick={(e) => updateOption(title, code, e)}>{title}</button>
              </li>
            ))}
          </ul>
        </li>
        <li className={styles["main-option"]}>
          <p className={styles.step1}>제어문</p>
          <ul className={styles["sub-options"]}>
            {control_codes.map(([title, code], index) => (
              <li key={index}>
                <button onClick={(e) => updateOption(title, code, e)}>{title}</button>
              </li>
            ))}
          </ul>
        </li>
        <li className={styles["main-option"]}>
          <p className={styles.step1}>리스트</p>
          <ul className={styles["sub-options"]}>
            {list_codes.map(([title, code], index) => (
              <li key={index}>
                <button onClick={(e) => updateOption(title, code, e)}>{title}</button>
              </li>
            ))}
          </ul>
        </li>
        <li className={styles["main-option"]}>
          <p className={styles.step1}>반복문</p>
          <ul className={styles["sub-options"]}>
            {repeat_codes.map(([title, code], index) => (
              <li key={index}>
                <button onClick={(e) => updateOption(title, code, e)}>{title}</button>
              </li>
            ))}
          </ul>
        </li>
        <li className={styles["main-option"]}>
          <p className={styles.step1}>함수</p>
          <ul className={styles["sub-options"]}>
            {function_codes.map(([title, code], index) => (
              <li key={index}>
                <button onClick={(e) => updateOption(title, code, e)}>{title}</button>
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default Dropdown;
