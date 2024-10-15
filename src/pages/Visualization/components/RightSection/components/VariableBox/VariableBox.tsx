import styles from "./VariableBox.module.css";
import cx from "classnames";
type Props = {
  value: string;
  name: string;
  isLight: boolean;
};
function VariableBox({ value, name, isLight }: Props) {
  return (
    <li>
        <div className="var-container">
             <div className="name">{name}</div>
             <div className={cx(styles["var-data"], isLight && styles.highlight)}>
                <span>{value}</span>
             </div>
        </div>
    </li>
  );
}

export default VariableBox;
