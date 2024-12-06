import { useContext, useRef, useEffect } from "react";
import { CodeContext } from "../../context/CodeContext";
import { Fragment } from "react/jsx-runtime";
import styles from "./LeftSection.module.css";
import CodeEditor from "./components/CodeEditor";
import Console from "./components/Console";
import Split from "react-split";
import Dropdown from "./components/Dropdown";

import { PreprocessedCodesContext } from "../../context/PreProcessedCodesContext";

// 성공 응답 타입 정의
interface props {
  onboardingStep: boolean[];
  setTutorialPosition: React.Dispatch<React.SetStateAction<{ top: number; left: number }>>;
}
const LeftSection = ({ onboardingStep, setTutorialPosition }: props) => {
  const preprocessedCodesContext = useContext(PreprocessedCodesContext); // context API로 데이터 가져오기

  if (!preprocessedCodesContext) {
    throw new Error("preprocessedCodesContext not found"); //context가 없을 경우 에러 출력 패턴 처리안해주면 에러 발생
  }
  const codeContext = useContext(CodeContext);

  if (!codeContext) {
    throw new Error("CodeContext not found");
  }
  const curriculumButtonRef = useRef<HTMLDivElement>(null);
  const consoleRef = useRef<HTMLDivElement>(null);
  const calculatePosition = () => {
    if (curriculumButtonRef && curriculumButtonRef.current) {
      const rect = curriculumButtonRef.current.getBoundingClientRect();
      if (onboardingStep[5]) {
        setTutorialPosition({
          top: rect.top + 50,
          left: rect.right,
        });
      }
    }
    if (consoleRef && consoleRef.current) {
      const rect = consoleRef.current.getBoundingClientRect();
      if (onboardingStep[6]) {
        setTutorialPosition({
          top: rect.top,
          left: rect.right + 10,
        });
      }
    }
  };
  useEffect(() => {
    // 초기 위치 설정
    calculatePosition();

    // 브라우저 크기 변경 이벤트 처리
    const handleResize = () => {
      calculatePosition();
    };

    window.addEventListener("resize", handleResize);
    // 클린업 함수: 이벤트 리스너 제거
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [onboardingStep]);
  return (
    <Fragment>
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div className={styles["top-bar"]}>
          <p className={styles["view-section-title"]}>코드 작성</p>
          <div className="flex items-center gap-4">
            <div ref={curriculumButtonRef} className={`tutorial-button ${onboardingStep[5] ? "active" : ""}`}>
              <Dropdown />
            </div>
          </div>
        </div>

        <Split
          sizes={[60, 40]}
          gutterSize={30}
          gutterAlign="center"
          dragInterval={1}
          direction="vertical"
          cursor="row-resize"
          style={{ display: "flex", flexDirection: "column", height: "94%", flex: 1, overflow: "hidden" }}
          className={styles.splitContainer}
        >
          <CodeEditor onboardingStep={onboardingStep} setTutorialPosition={setTutorialPosition} />
          <div ref={consoleRef} className={`tutorial-button ${onboardingStep[6] ? "active" : ""}`}>
            <Console />
          </div>
        </Split>
      </div>
    </Fragment>
  );
};

export default LeftSection;
