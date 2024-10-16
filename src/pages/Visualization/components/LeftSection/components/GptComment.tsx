import { useMutation } from "@tanstack/react-query";
import { useContext, useRef } from "react";
import { CodeContext } from "@/pages/Visualization/Visualization";
import { useTimeoutStore } from "@/store/timeout";
import { useGptTooltipStore } from "@/store/gptTooltip";
import { useEditorStore } from "@/store/editor";
import { useGptMutationStore } from "@/store/gptMutation";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useResetEditor } from "@/store/resetEditor";


interface ModifiedCode {
  line: number;
  code: string;
}

interface GptCorrectResponse {
  result: {
    reason: string;
    modified_codes: ModifiedCode[];
  };
}

interface GptHintResponse {
  result: {
    hint: string;
    line: number;
  };
}

const GptComment = () => {
  const context = useContext(CodeContext);
  const { setTimeoutId, clearCurrentTimeout } = useTimeoutStore();
  const { setIsGptToggle, gptPin, setGptPin, gptLeft, gptTop } = useGptTooltipStore();
  const { resetEditor, errorLine } = useEditorStore();
  const { resetTrigger, setResetTrigger } = useResetEditor();
  const {
    isGptCorrectSuccess,
    isGptHintSuccess,
    reason,
    hint,
    hintLine,
    modifiedCode,
    setGptCorrectSuccess,
    setGptHintSuccess,
    setReason,
    setHint,
    setHintLine,
    setModifiedCode,
    resetState,
  } = useGptMutationStore();

  const timeoutRef = useRef<number | null>(null);

  if (!context) {
    console.error("CodeContext not found");
    return null;
  }

  const { code, setCode } = context;
  // 간단한 구문 강조 함수
  const highlightSyntax = (code: string) => {
    return code
      .replace(/(\/\/.*)/g, '<span style="color: #888;">$1</span>')
      .replace(/('.*?'|".*?")/g, '<span style="color: #a11;">$1</span>')
      .replace(/\b(function|const|let|var|return|if|else|for|while)\b/g, '<span style="color: #11a;">$1</span>')
      .replace(/\b(true|false|null|undefined)\b/g, '<span style="color: #a1a;">$1</span>');
  };
  const handleMouseOver = () => {
    clearCurrentTimeout();
    setIsGptToggle(true);
  };

  const handleMouseLeave = () => {
    clearCurrentTimeout();

    if (!gptPin) {
      timeoutRef.current = setTimeout(() => {
        setIsGptToggle(false);
        setTimeoutId(null);
      }, 300);
      setTimeoutId(timeoutRef.current);
    }
  };

  const fetchGptCorrect = async (code: string): Promise<GptCorrectResponse> => {
    const response = await fetch("http://localhost:8080/edupi-syntax/v1/advice/correct", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source_code: code }),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  };

  const gptCorrectMutation = useMutation({
    mutationFn: fetchGptCorrect,
    async onSuccess(data) {
      setReason(data.result.reason);
      const newModifiedCode = data.result.modified_codes.reduce((acc: ModifiedCode[], cur: ModifiedCode) => {
        if (acc.length === 0) {
          acc.push(cur);
          return acc;
        }
        if (acc[acc.length - 1].line - cur.line !== -1) {
          acc.push({ line: 0, code: "" });
          acc.push(cur);
          return acc;
        }
        acc.push(cur);
        return acc;
      }, []);

      setModifiedCode(newModifiedCode);
      setGptCorrectSuccess(true);
    },
    onError(error) {
      console.error("An error occurred:", error);
      // TODO: Add user-facing error handling
    },
  });

  const fetchGptHint = async (code: string, lineNumber: number): Promise<GptHintResponse> => {
    const response = await fetch("http://localhost:8080/edupi-syntax/v1/advice/hint", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ line: lineNumber, source_code: code }),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  };

  const gptHintMutation = useMutation({
    mutationFn: () => fetchGptHint(code, errorLine?.lineNumber || 1),
    onSuccess(data) {
      setHint(data.result.hint);
      setHintLine(data.result.line);
      setGptHintSuccess(true);
    },
    onError(error) {
      console.error("An error occurred:", error);
      // TODO: Add user-facing error handling
    },
  });

  const handleApprove = () => {
    const newCode = code
      .split("\n")
      .map((line, index) => {
        const modifiedLine = modifiedCode.find((tmp) => tmp.line === index + 1);
        return modifiedLine ? modifiedLine.code : line;
      })
      .join("\n");

    setCode(newCode);
    setGptPin(false);
    setIsGptToggle(false);
    resetState();
    resetEditor();
    setResetTrigger(!resetTrigger);
  };

  const handleReject = () => {
    clearCurrentTimeout();
    setIsGptToggle(false);
    setGptPin(false);
    resetState();
  };

  const handleCorrect = () => {
    setGptPin(true);
    clearCurrentTimeout();
    setIsGptToggle(true);
    resetEditor();
    gptCorrectMutation.mutate(code);
  };

  const handleHint = () => {
    setGptPin(true);
    clearCurrentTimeout();
    setIsGptToggle(true);
    gptHintMutation.mutate();
  };
  const handleCloseHint = () => {
    clearCurrentTimeout();
    setIsGptToggle(false);
    setGptPin(false);
    resetState();
  };

  return (
    <div
      className="gpt-comment"
      style={{ top: gptTop, left: gptLeft, zIndex: 9999 }}
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
    >
      {isGptCorrectSuccess ? (
        <div className="gpt-success">
          <img
            className="gpt-icon"
            src="/image/icon_gpt2.svg"
            alt="즉시교정"
          />

          <div className="container">
            {reason}
            <br/>
            <div className="code-container">
            <pre className="highlighted-code">
              {modifiedCode.map((code, index) =>
                  code.code === "" ? (
                      <div key={index} className="ellipsis-container">
                        <div className="line ellipsis">
                          <span style={{color: "gray"}}>...</span>
                        </div>
                      </div>
                  ) : (
                      <SyntaxHighlighter language={"python"} style={oneLight}>
                        {code.code}
                      </SyntaxHighlighter>

                      // <div key={index} dangerouslySetInnerHTML={{__html: highlightSyntax(code.code)}}/>
                  )
              )}
            </pre>
            </div>
          </div>
          <div className="button-left">
            <button className="approve" onClick={handleApprove}>
              교정
            </button>
            <button className="reject" onClick={handleReject}>
              거절
            </button>
          </div>
        </div>
      ) : isGptHintSuccess ? (
          <div className="gpt-hint">
            <div className="gpt-success">
              <img
                  className="gpt-icon"
                  src="/image/icon_gpt2.svg"
                  alt="즉시교정"
              />
              {hint}
              <div className="button-left">
              <button className="approve" onClick={handleCloseHint}>
                확인
              </button>
            </div>
          </div>
        </div>
      ) : gptCorrectMutation.isPending || gptHintMutation.isPending ? (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <>
          <button className="instant-correction" onClick={handleCorrect}>
            <img src="/image/icon_correction.svg" style={{ width: 19, height: 19 ,marginBottom:2}} alt="즉시교정" />
            즉시교정
          </button>
          <button className="view-hint" onClick={handleHint}>
            <img src="/image/icon_hint_color.svg" style={{ width: 19, height: 19, marginBottom:5 }} alt="힌트보기" />
            힌트보기
          </button>
        </>
      )}
    </div>
  );
};

export default GptComment;
