import { useContext, Fragment, useRef, useEffect, useState } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { CodeContext } from "../../../Visualization";
// Zustand
import { useEditorStore } from "@/store/editor";
import { useConsoleStore } from "@/store/console";
import { useGptTooltipStore } from "@/store/gptTooltip";
import { useTimeoutStore } from "@/store/timeout";
const CodeEditor = () => {
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
  const resetEditor = useEditorStore((state) => state.resetEditor);
  const setIsGptToggle = useGptTooltipStore((state) => state.setIsGptToggle);
  const { setGptTop, setGptLeft } = useGptTooltipStore();
  const { setTimeoutId, clearCurrentTimeout } = useTimeoutStore();
  const { gptPin } = useGptTooltipStore();
  const timeoutRef = useRef<number | null>(null);
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
  }, [stepIdx, highlightLines]);

  useEffect(() => {
    if (editorRef.current && errorLine) {
      displayErrorLine(errorLine);
      handleEditorDidMount(editorRef.current, monaco);
    }
  }, [errorLine]);
  const handleResetEditor = () => {
    resetEditor();

    if (editorRef.current) {
      // 데코레이션 컬렉션 리셋
      if (decorationsCollectionRef.current) {
        decorationsCollectionRef.current.clear();
      }
    }
  };
  const displayErrorLine = (errorLine: { lineNumber: number; message: string } | null) => {
    if (!editorRef.current || !errorLine) return;

    const editor = editorRef.current;
    const model = editor.getModel();
    if (!model) return;

    const { lineNumber, message } = errorLine;

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

  return (
    <Fragment>
      <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
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
          .red-thick-underline {
            text-decoration: underline;
            text-decoration-color: red;
            text-decoration-thickness: 3px;
          }
          .error-line {
            background-color: rgba(255, 0, 0, 0.1);
          }
        `}</style>
      </div>
    </Fragment>
  );
};

export default CodeEditor;
