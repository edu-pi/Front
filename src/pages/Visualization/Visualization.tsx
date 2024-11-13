import { useState } from "react";
import styles from "./Visualization.module.css";
import "./gutter.css";

import Header from "../components/Header";
import LeftSection from "./components/LeftSection/LeftSection";
import RightSection from "./components/RightSection/RightSection";
import GptComment from "./components/LeftSection/components/GptComment";
import GptIcon from "./components/LeftSection/components/GptIcon";

import Split from "react-split";
import { ValidTypeDto } from "@/pages/Visualization/types/dto/ValidTypeDto";
import { CodeContext } from "./context/CodeContext";
import { PreprocessedCodesContext } from "./context/PreProcessedCodesContext";
import { InputErrorContext } from "./context/InputErrorContext";
//zustand store
import { useEditorStore } from "@/store/editor";
import { useGptTooltipStore } from "@/store/gptTooltip";

const Visualization = () => {
  const [code, setCode] = useState<any>(
    [
      "# example\n" +
        "for i in range(2, 10):\n" +
        "   for j in range(1, 10):\n" +
        '      print(f"{i} x {j} = {i * j}")\n' +
        "   print()\n",
    ].join("\n")
  );
  const [preprocessedCodes, setPreprocessedCodes] = useState<ValidTypeDto[]>([]);
  const [isInputError, setIsInputError] = useState(false);
  // zustand store

  const { focus } = useEditorStore();
  const isGptToggle = useGptTooltipStore((state) => state.isGptToggle);
  const gptPin = useGptTooltipStore((state) => state.gptPin);

  return (
    <CodeContext.Provider value={{ code, setCode }}>
      <PreprocessedCodesContext.Provider value={{ preprocessedCodes, setPreprocessedCodes }}>
        <InputErrorContext.Provider value={{ isInputError, setIsInputError }}>
          <Header />

          <main className={styles.main}>
            {focus && gptPin ? <GptIcon /> : (gptPin || isGptToggle) && <GptComment />}

            <Split
              sizes={[30, 70]}
              minSize={100}
              expandToMin={false}
              gutterSize={10}
              gutterAlign="center"
              snapOffset={30}
              dragInterval={1}
              direction="horizontal"
              cursor="col-resize"
              style={{ display: "flex", width: "99vw", height: "100%" }}
            >
              <LeftSection />
              <RightSection />
            </Split>
          </main>
        </InputErrorContext.Provider>
      </PreprocessedCodesContext.Provider>
    </CodeContext.Provider>
  );
};
export default Visualization;
