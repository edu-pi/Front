import { useRef, ReactNode } from "react";
import { CodeFlowItem as CodeFlowItemType } from "../types";

interface Props {
  codeFlow: CodeFlowItemType;
  children?: ReactNode;
}

const CodeFlowItem = ({ codeFlow, children }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div style={{ width: "fit-content" }} ref={ref} id={codeFlow.isLight ? "highlighted-code-flow" : undefined}>
      {children}
    </div>
  );
};

export default CodeFlowItem;
