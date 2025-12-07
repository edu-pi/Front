import { useContext, Fragment, useRef, useEffect } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { CodeContext } from "@/pages/Visualization/context/CodeContext";
// Zustand
import { useEditorStore } from "@/store/editor";
import { useConsoleStore } from "@/store/console";
import { useGptTooltipStore } from "@/store/gptTooltip";
import { useTimeoutStore } from "@/store/timeout";
import { useResetEditor } from "@/store/resetEditor";
interface props {
  onboardingStep: boolean[];
  setTutorialPosition: React.Dispatch<React.SetStateAction<{ top: number; left: number }>>;
}
const CodeEditor = ({ onboardingStep, setTutorialPosition }: props) => {
  const context = useContext(CodeContext);
  const decorationsCollectionRef = useRef<monaco.editor.IEditorDecorationsCollection | null>(null);

  if (!context) {
    console.error("CodeContext not found");
    return null;
  }

  const { code, setCode } = context;
  const highlightLines = useEditorStore((state) => state.highlightLines);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const stepIdx = useConsoleStore((state) => state.stepIdx);
  const errorLine = useEditorStore((state) => state.errorLine);
  const resetErrorLine = useEditorStore((state) => state.resetErrorLine);
  const setFocus = useEditorStore((state) => state.setFocus);
  const setIsGptToggle = useGptTooltipStore((state) => state.setIsGptToggle);
  const setGptTop = useGptTooltipStore((state) => state.setGptTop);
  const setGptLeft = useGptTooltipStore((state) => state.setGptLeft);
  const setTimeoutId = useTimeoutStore((state) => state.setTimeoutId);
  const clearCurrentTimeout = useTimeoutStore((state) => state.clearCurrentTimeout);
  const gptPin = useGptTooltipStore((state) => state.gptPin);
  const setGptPin = useGptTooltipStore((state) => state.setGptPin);
  const resetTrigger = useResetEditor((state) => state.resetTrigger);
  const timeoutRef = useRef<number | null>(null);
  const codeEditorRef = useRef<HTMLDivElement | null>(null);
  const calculatePosition = () => {
    if (codeEditorRef && codeEditorRef.current) {
      const rect = codeEditorRef.current.getBoundingClientRect();
      if (onboardingStep[0]) {
        setTutorialPosition({
          top: rect.top,
          left: rect.right + 50,
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

  // 컴포넌트가 언마운트될 때 timeout 정리
  useEffect(() => {
    return () => {
      clearCurrentTimeout();
    };
  }, [clearCurrentTimeout]);

  useEffect(() => {
    if (editorRef.current) {
      highlightLine(highlightLines[stepIdx]);
    }
    // 코드 실행 버튼 눌렀을때 highlightLines를 []로 초기화 그래서 코드에디터 쪽 0으로 초기화
    if (highlightLines.length === 0) {
      resetHighlightLine(0);
    }
  }, [stepIdx, highlightLines]);

  useEffect(() => {
    if (editorRef.current && errorLine) {
      displayErrorLine(errorLine);
      handleEditorDidMount(editorRef.current, monaco);
    }
  }, [errorLine]);
  const handleResetEditor = () => {
    resetErrorLine();
    setGptPin(false);
    setIsGptToggle(false);
    if (editorRef.current) {
      // 데코레이션 컬렉션 리셋
      if (decorationsCollectionRef.current) {
        decorationsCollectionRef.current.clear();
      }
    }
  };
  useEffect(() => {
    handleResetEditor();
  }, [resetTrigger]);
  const displayErrorLine = (errorLine: { lineNumber: number; message: string } | null) => {
    if (!editorRef.current || !errorLine) return;

    const editor = editorRef.current;
    const model = editor.getModel();
    if (!model) return;

    const { lineNumber } = errorLine;

    const endColumn = model.getLineMaxColumn(lineNumber);

    const lineContent = model.getLineContent(lineNumber);
    let startColumn = 1;
    for (let i of lineContent) {
      if (i === " ") {
        startColumn++;
      } else {
        break;
      }
    }

    if (!decorationsCollectionRef.current) {
      decorationsCollectionRef.current = editor.createDecorationsCollection();
    }

    decorationsCollectionRef.current.set([
      {
        range: new monaco.Range(lineNumber, startColumn, lineNumber, endColumn),
        options: {
          isWholeLine: false,
          className: "error-line",
          inlineClassName: "red-thick-underline",
        },
      },
    ]);
  };

  const handleEditorDidMount: OnMount = (editor, monacoInstance) => {
    editorRef.current = editor;

    editor.onMouseMove((e) => {
      if (e.target.type === monaco.editor.MouseTargetType.CONTENT_TEXT) {
        const position = e.target.position;
        if (position && errorLine) {
          const lineNumber = position.lineNumber;
          if (lineNumber === errorLine.lineNumber) {
            const model = editor.getModel();
            const lineContent = model?.getLineContent(lineNumber);
            const firstNonWhitespace = lineContent?.search(/\S/);
            let column: number = 0;
            if (firstNonWhitespace && firstNonWhitespace !== -1) {
              // 실제 텍스트가 시작하는 열(column) 위치
              column = firstNonWhitespace + 1; // Monaco는 1-based indexing 사용
            }
            const errorLineCoords = editor.getScrolledVisiblePosition({
              lineNumber: errorLine.lineNumber,
              column: column,
            });
            const editorDomNode = editor.getDomNode();

            if (editorDomNode && errorLineCoords) {
              const editorCoords = editorDomNode.getBoundingClientRect();

              const globalLeft = editorCoords.left + errorLineCoords.left;
              const globalTop = editorCoords.top + errorLineCoords.top;

              setGptLeft(globalLeft);
              setGptTop(globalTop + 30);
            }
          }

          const decorations = editor.getModel()?.getAllDecorations() || [];
          const errorDecoration = decorations.find((d) => d.options.className === "error-line");
          // 에러 라인에 마우스가 올라가면 gpt 툴팁을 보여줌
          if (errorDecoration && errorDecoration.range.startLineNumber === lineNumber) {
            clearCurrentTimeout();
            setIsGptToggle(true);
            return;
          }
          // 에러 라인에서 마우스가 벗어나면 gpt 툴팁을 숨김
          else if (errorDecoration && errorDecoration.range.startLineNumber !== lineNumber) {
            clearCurrentTimeout();
            if (!gptPin) {
              timeoutRef.current = window.setTimeout(() => {
                setIsGptToggle(false);
                setTimeoutId(null);
              }, 300);
              setTimeoutId(timeoutRef.current);
              return;
            }
          }
        }
      }
      // 에디터 번호가 아닌 다른 곳에 마우스가 올라가면 gpt 툴팁을 숨김

      if (!gptPin) {
        clearCurrentTimeout();

        timeoutRef.current = window.setTimeout(() => {
          setIsGptToggle(false);
          setTimeoutId(null);
        }, 300);
        setTimeoutId(timeoutRef.current);
      }
    });
    // 에디터에서 마우스가 벗어나면 gpt 툴팁을 숨김
    editor.onMouseLeave(() => {
      clearCurrentTimeout();
      if (!gptPin) {
        timeoutRef.current = window.setTimeout(() => {
          setIsGptToggle(false);
          setTimeoutId(null);
        }, 300);
        setTimeoutId(timeoutRef.current);
      }
    });
    // Hover provider 등록 (한 번만 등록)
    monacoInstance.languages.registerHoverProvider("python", {
      provideHover: function (model, position) {
        const range = new monacoInstance.Range(
          position.lineNumber,
          1,
          position.lineNumber,
          model.getLineMaxColumn(position.lineNumber)
        );
        const decorations = model.getDecorationsInRange(range) || [];

        const errorDecoration = decorations.find((d) => d.options.className === "error-line");
        if (errorDecoration) {
          return {
            range: errorDecoration.range,
            contents: [],
          };
        }
      },
    });
    // 포커스 이벤트 리스너 추가
    editor.onDidFocusEditorText(() => {
      setFocus(true);
    });
    // 포커스 해제 이벤트 리스너 추가
    editor.onDidBlurEditorText(() => {
      setFocus(false);
    });
  };

  const highlightLine = (lineNumber: number) => {
    if (!editorRef.current) return;

    if (!decorationsCollectionRef.current) {
      decorationsCollectionRef.current = editorRef.current.createDecorationsCollection();
    }

    decorationsCollectionRef.current.set([
      {
        range: new monaco.Range(lineNumber, 1, lineNumber, 1),
        options: {
          isWholeLine: true,
          className: "myLineHighlight",
        },
      },
    ]);
  };
  const resetHighlightLine = (lineNumber: number) => {
    if (!editorRef.current) return;

    if (!decorationsCollectionRef.current) {
      decorationsCollectionRef.current = editorRef.current.createDecorationsCollection();
    }

    decorationsCollectionRef.current.set([
      {
        range: new monaco.Range(lineNumber, 1, lineNumber, 1),
        options: {},
      },
    ]);
  };

  return (
    <Fragment>
      <div
        ref={codeEditorRef}
        style={{ width: "100%", height: "100%", overflow: "hidden" }}
        className={`tutorial-button ${onboardingStep[0] ? "active" : ""}`}
      >
        <Editor
          defaultLanguage="python"
          value={code}
          onMount={handleEditorDidMount}
          onChange={(value) => {
            setCode(value || "");
            handleResetEditor();
          }}
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 16,
          }}
        />
        <style>{`
          .error-line {
            background-color: rgba(255, 0, 0, 0.1);
          }
          .myLineHighlight {
            background-color: #EAECFF;
          }
        `}</style>
      </div>
    </Fragment>
  );
};

export default CodeEditor;
