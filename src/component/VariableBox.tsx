"use client";
import styles from "./VariableBox.module.css";
import cx from "classnames";
type Props = {
  value: number;
  name: string;
  lightOn: boolean;
};
function VariableBox({ value, name, lightOn }: Props) {
  return (
    <div className={styles.variable_box}>
      <div className={cx(styles.variable_border, lightOn && styles.highlight)}>
        <span className={styles.variable_text}>{name}</span>
        <span>{value}</span>
      </div>
    </div>
  );
}

export default VariableBox;
