import { useState, useContext, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { CodeContext } from "../../context/CodeContext";
import { PreprocessedCodesContext } from "../../context/PreProcessedCodesContext";
import { useCustomAlert } from "@/pages/components/CustomAlert";
import Split from "react-split";
import _ from "lodash";
import ResizeObserver from "resize-observer-polyfill";
import styles from "./RightSection.module.css";
// components
import Arrow from "./components/Arrow/Arrow";
import { useCodeVisualizationMutation } from "./hooks/useCodeVisualizationMutation";
import { useCodeExecutionMutation } from "./hooks/useCodeExecutionMutation";
import { usePreprocessedCodesProcessor } from "./hooks/usePreprocessedCodesProcessor";
import { useConsoleStore, useCodeFlowLengthStore } from "@/store/console";
import { useRightSectionStore } from "@/store/arrow";
import { useEditorStore } from "@/store/editor";
import { AppendDto } from "../../types/dto/appendDto";
import { useMutation } from "@tanstack/react-query";
import { useArrowStore } from "@/store/arrow";

//api
import { runCode, visualize } from "@/services/api";
import { CodeFlowVariableItem } from "../../types/codeFlow/codeFlowVariableItem";
import { InputErrorContext } from "@/pages/Visualization/context/InputErrorContext";
interface State {
  objects: any[];
}

interface ApiError {
  code: string;
  result: {
    error: string[];
  };
  message: string;
}

// 성공 응답 타입 정의
interface SuccessResponse {
  result: {
    code: any[];
    setTutorialPosition: React.Dispatch<React.SetStateAction<{ top: number; left: number }>>;
  };
}
interface props {
  onboardingStep: boolean[];
  setTutorialPosition: React.Dispatch<React.SetStateAction<{ top: number; left: number }>>;
}
const RightSection = ({ onboardingStep, setTutorialPosition }: props) => {
  const { openAlert, CustomAlert } = useCustomAlert();
  const location = useLocation();
  const [codeFlowList, setCodeFlowList] = useState<State[]>([
    {
      objects: [{ id: 0, type: "start", depth: 0, isLight: false, child: [] }],
    },
  ]);
  const [StructuresList, setStructuresList] = useState<any>([]); // 변수 데이터 시각화 리스트의 변화과정을 담아두는 리스트
  const preprocessedCodesContext = useContext(PreprocessedCodesContext); // context API로 데이터 가져오기
  const codeContext = useContext(CodeContext);
  const inputErrorContext = useContext(InputErrorContext);

  if (!preprocessedCodesContext) {
    throw new Error("preprocessedCodesContext not found"); //context가 없을 경우 에러 출력 패턴 처리안해주면 에러 발생
  }
  if (!codeContext) {
    throw new Error("CodeContext not found");
  }
  if (!inputErrorContext) {
    throw new Error("InputErrorContext not found");
  }
  const setConsoleList = useConsoleStore((state) => state.setConsoleList);
  const stepIdx = useConsoleStore((state) => state.stepIdx);
  const setStepIdx = useConsoleStore((state) => state.setStepIdx);
  const { inputData } = useConsoleStore();
  const { preprocessedCodes, setPreprocessedCodes } = preprocessedCodesContext;
  const { setIsInputError } = inputErrorContext;
  const [arrowTextList, setArrowTextList] = useState<string[]>([]);

  const [, setRightSectionSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [codeFlowScrollTop, setCodeFlowScrollTop] = useState<number>(0);
  const [structuresScrollTop, setStructuresScrollTop] = useState<number>(0);
  const rightSectionRef = useRef<HTMLDivElement | null>(null);
  const rightSection2Ref = useRef<HTMLDivElement | null>(null);

  const setWidth = useRightSectionStore((state) => state.setWidth);
  const setHeight = useRightSectionStore((state) => state.setHeight);

  const width = useRightSectionStore((state) => state.width);
  const height = useRightSectionStore((state) => state.height);
  const setHighlightLines = useEditorStore((state) => state.setHighlightLines);

  //위에 시각화 조절 버튼 상태관리
  const [isPlaying, setIsPlaying] = useState(false);
  const resetConsole = useConsoleStore((state) => state.resetConsole);
  const setDisplayNone = useArrowStore((state) => state.setDisplayNone);
  const setErrorLine = useEditorStore((state) => state.setErrorLine);
  const setCodeFlowLength = useCodeFlowLengthStore((state) => state.setCodeFlowLength);
  const codeFlowLength = useCodeFlowLengthStore((state) => state.codeFlowLength);
  const consoleIdx = useConsoleStore((state) => state.stepIdx);
  const incrementStepIdx = useConsoleStore((state) => state.incrementStepIdx);
  const decrementStepIdx = useConsoleStore((state) => state.decrementStepIdx);
  const [selectedValue, setSelectedValue] = useState("1x");
  const visualizeButtonRef = useRef<HTMLDivElement | null>(null);
  const ResultButtonRef = useRef<HTMLDivElement | null>(null);
  const visualizeController = useRef<HTMLDivElement | null>(null);
  const speedButton = useRef<HTMLDivElement | null>(null);
  const codeVizMutation = useCodeVisualizationMutation({ setIsPlaying });
  const codeExecMutation = useCodeExecutionMutation();
  useEffect(() => {
    return () => {
      setStepIdx(0);
    };
  }, [setStepIdx, location]);
  const calculatePosition = () => {
    if (visualizeButtonRef && visualizeButtonRef.current) {
      const rect = visualizeButtonRef.current.getBoundingClientRect();
      if (onboardingStep[1])
        setTutorialPosition({
          top: rect.top + 50,
          left: rect.left - 400,
        });
    }
    if (ResultButtonRef && ResultButtonRef.current) {
      const rect = ResultButtonRef.current.getBoundingClientRect();
      if (onboardingStep[2])
        setTutorialPosition({
          top: rect.top + 50,
          left: rect.left - 400,
        });
    }
    if (visualizeController && visualizeController.current) {
      const rect = visualizeController.current.getBoundingClientRect();
      if (onboardingStep[3])
        setTutorialPosition({
          top: rect.top + 50,
          left: rect.left - 385,
        });
    }
    if (speedButton && speedButton.current) {
      const rect = speedButton.current.getBoundingClientRect();
      if (onboardingStep[4])
        setTutorialPosition({
          top: rect.top + 50,
          left: rect.left - 290,
        });
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

  const codeVizMutation = useMutation<SuccessResponse, ApiError, Parameters<typeof visualize>[0]>({
    mutationFn: visualize,
    async onSuccess(data) {
      // 타입 체크 함수
      if (isNotServiceDtoType(data.result.code)) {
        console.error("시각화를 지원하지 않는 코드가 포함되어 있습니다.");
        throw new Error("시각화를 지원하지 않는 코드가 포함되어 있습니다.");
      }
      if (isValidTypeDtoArray(data.result.code)) {
        resetConsole();
        setPreprocessedCodes(data.result.code);
        setDisplayNone(false);
        setIsPlaying(() => true);
      } else {
        console.error("데이터 형식이 올바르지 않습니다");
        throw new Error("데이터 형식이 올바르지 않습니다");
      }
    },
    onError(error) {
      console.error(error);

      if (error.message === "데이터 형식이 올바르지 않습니다") {
        return;
      } else if (error.code === "CA-400006" || error.code === "CA-400999") {
        openAlert("지원하지 않는 코드가 포함되어 있습니다.");
        return;
      } else if ((error as any).code === "CA-400005") {
        setIsInputError(true);
        openAlert("입력된 input의 개수가 적습니다.");
      } else if (error.message === "시각화를 지원하지 않는 코드가 포함되어 있습니다.") {
        openAlert("시각화를 지원하지 않는 코드가 포함되어 있습니다.");
        return;
      } else if (error.code === "CA-400002") {
        const linNumber = Number((error as any).result.lineNumber);
        const errorMessage = (error as any).result.errorMessage;
        setErrorLine({ lineNumber: linNumber, message: errorMessage });
        setConsoleList([errorMessage]);
        setPreprocessedCodes([]);
        return;
      } else if (error.code == "CA-400007") {
        openAlert("코드의 실행 횟수가 너무 많습니다.");

        return;
      }
      setConsoleList([]);
      setPreprocessedCodes([]);
    },
  });

  const { code } = codeContext;

  const codeExecMutation = useMutation({
    mutationFn: runCode,
    async onSuccess(data) {
      setPreprocessedCodes([]);
      setCodeFlowLength(0);
      setStepIdx(0);
      setConsoleList([data.result.output]);
      setHighlightLines([]);
    },
    onError(error) {
      console.error(error);

      if (error.message === "데이터 형식이 올바르지 않습니다") {
        return;
      } else if ((error as any).code === "CA-400006" || (error as any).code === "CA-400999") {
        openAlert("지원하지 않는 코드가 포함되어 있습니다");
        return;
      } else if ((error as any).code === "CA-400005") {
        setIsInputError(true);
        openAlert("입력된 input의 갯수가 적습니다.");
      } else if ((error as any).code === "CA-400002") {
        // 잘못된 문법 에러처리
        const linNumber = Number((error as any).result.lineNumber);
        const errorMessage = (error as any).result.errorMessage;
        setErrorLine({ lineNumber: linNumber, message: errorMessage });
        setConsoleList([errorMessage]);
        setPreprocessedCodes([]);

        return;
      } else if ((error as any).code == "CA-400007") {
        openAlert("코드의 실행 횟수가 너무 많습니다.");
        return;
      }
      setConsoleList([]);
    },
  });
  const handleRunCode = () => {
    codeExecMutation.mutate({ code, inputData });
  };
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    codeVizMutation.mutate({ code, inputData });
  };
  const onPlay = () => {
    if (codeFlowLength === 0) return;
    setIsPlaying((prev) => !prev);
  };
  const onForward = useCallback(() => {
    if (consoleIdx < codeFlowLength - 1) {
      incrementStepIdx();
    }
  }, [consoleIdx, codeFlowLength]);
  const onBack = useCallback(() => {
    if (consoleIdx > 0) {
      decrementStepIdx();
    }
  }, [consoleIdx]);
  const intervalRef = useRef<number | null>(null);
  useEffect(() => {
    if (isPlaying) {
      if (selectedValue === "1x") {
        intervalRef.current = setInterval(onForward, 1000);
      } else if (selectedValue === "2x") {
        intervalRef.current = setInterval(onForward, 500);
      } else if (selectedValue === "3x") {
        intervalRef.current = setInterval(onForward, 300);
      } else if (selectedValue === "0.5x") {
        intervalRef.current = setInterval(onForward, 2000);
      } else {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      }
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [isPlaying, consoleIdx, codeFlowLength]);

  useEffect(() => {
    if (!rightSectionRef.current) return;
    const resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setRightSectionSize({ width, height });
        setWidth(width);
        setHeight(height);
      }
    });
    resizeObserver.observe(rightSectionRef.current);

    return () => {
      if (rightSectionRef.current) {
        resizeObserver.unobserve(rightSectionRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!rightSection2Ref.current) return;
    const resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setRightSectionSize({ width, height });
        setWidth(width);
        setHeight(height);
      }
    });
    resizeObserver.observe(rightSection2Ref.current);

    return () => {
      if (rightSection2Ref.current) {
        resizeObserver.unobserve(rightSection2Ref.current);
      }
    };
  }, []);

  const handleScrollCodeFlow = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.target as HTMLDivElement;
    const scrollTop = element.scrollTop;
    setCodeFlowScrollTop(scrollTop);
  };
  const handleScrollStructures = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.target as HTMLDivElement;
    const scrollTop = element.scrollTop;
    setStructuresScrollTop(scrollTop);
  };
  // 시각화를 할때 왼쪽 코드 에디터에서 하이라이트를 줄 라인을 담는 배열
  const highlightLine: number[] = [];
  // codeFlowList를 업데이트하는 useEffect
  useEffect(() => {
    let prevTrackingId: number = 0;
    let prevTrackingDepth: number = 0;
    let activate: ActivateItem[] = [];
    let usedId: number[] = [];
    const usedName: usedNameObjectType = { main: [] };
    let accCodeFlow: State = {
      objects: [{ id: 0, type: "start", depth: 0, isLight: false, child: [] }],
    };
    let accDataStructures: WrapperDataStructureItem = {
      main: { data: [], isLight: false },
    };

    const accCodeFlowList: State[] = [];
    const accDataStructuresList: AllDataStructureItem = [];
    const accConsoleLogList: string[] = [];
    let accConsoleLog: string = "";
    const arrowTexts: string[] = [];
    if (preprocessedCodes.length === 0) {
      setCodeFlowList([]);
      setStructuresList([]);
      setCodeFlowLength(0);
      setArrowTextList([]);
      setDisplayNone(true);
      return;
    }

    for (let preprocessedCode of preprocessedCodes) {
      console.log(preprocessedCode);
      let changedCodeFlows: any[] = [];
      if (preprocessedCode.type.toLowerCase() === "whiledefine") {
        continue;
      }

      accDataStructures = Object.entries(accDataStructures).reduce((acc, [key, value]) => {
        acc[key] = {
          data: value.data.map((structure) => ({
            ...structure,
          })),
          isLight: false,
        };
        return acc;
      }, {} as WrapperDataStructureItem);
      // enduserFunc 타입이 들어왔을 때 코드흐름과 변수 부분 함수를 지우고 return value를 나타나게 한다
      // 나타나고 바로 사라지는건 traking id와 depth를 사용하지 않는다
      if (preprocessedCode.type.toLowerCase() === "endUserFunc".toLowerCase()) {
        highlightLine.push((preprocessedCode as EndUserFuncDto).id);
        const delName = (preprocessedCode as EndUserFuncDto).delFuncName;
        delete accDataStructures[delName]; // 함수 이름을 키로 가지는 객체를 삭제
        delete usedName[delName];
        const toAddObject = createObjectToAdd(preprocessedCode as EndUserFuncDto);

        // isLight를 true로 바꿔준다
        toAddObject.isLight = true;
        let finallyCodeFlow: any;
        let deletedCodeFlow = deleteCodeFlow(accCodeFlow.objects, (preprocessedCode as EndUserFuncDto).id);
        accCodeFlow = { objects: deletedCodeFlow };
        if (toAddObject.depth > prevTrackingDepth) {
          finallyCodeFlow = insertIntoDepth(accCodeFlow.objects, toAddObject, prevTrackingId);
        } else if (toAddObject.depth === prevTrackingDepth) {
          finallyCodeFlow = insertEqualToDepth(accCodeFlow.objects, toAddObject, prevTrackingId);
        } else {
          finallyCodeFlow = addCodeFlow(accCodeFlow.objects, toAddObject);
        }

        accCodeFlow = { objects: finallyCodeFlow };
        arrowTexts.push((preprocessedCode as EndUserFuncDto).code);
      }
      // append 타입이 들어왔을 떄 변수흐름의 변화는 따로 처리
      else if (preprocessedCode.type.toLowerCase() === "append".toLowerCase()) {
        const callStackName = (preprocessedCode as AppendDto).callStackName;
        const variable = (preprocessedCode as AppendDto).variable;
        highlightLine.push(variable.id);
        if (variable.type.toLowerCase() === "variable") {
          accDataStructures[callStackName].data.map((data: DataStructureVarsItem) => {
            if (data.name === variable.name) {
              data.highlightIdx = [data.expr.length - 1];
              if (data.expr[0] === "") {
                data.expr.shift();
                data.expr.push(variable.expr);
              } else {
                data.expr.push(variable.expr);
              }

              if (data.idx) {
                data.idx.start = data.expr.length - 1;
                data.idx.end = data.expr.length - 1;
              }
            }
          });
          arrowTexts.push(variable.code);
        }

        // 코드 흐름 시각화에서 표현된 자료구조 시각화 객체를 삭제하는 부분
        let deletedCodeFlow = deleteCodeFlow(accCodeFlow.objects, variable.id!);
        usedId = usedId.filter((id) => id !== variable.id);
        accCodeFlow = { objects: deletedCodeFlow };
      }
      // 자료구조 시각화 부분이 들어왔을 때
      // 나타나고 바로 사라지는건 traking id와 depth를 사용하지 않는다
      else if (preprocessedCode.type.toLowerCase() === "assign".toLowerCase()) {
        const callStackName = (preprocessedCode as VariablesDto).callStackName;
        // 오른쪽에 변수로 함수를 넣을 때
        if ((preprocessedCode as VariablesDto).variables[0].type.toLowerCase() === "function".toLowerCase()) {
          const { id, expr, name, type, code } = (preprocessedCode as VariablesDto).variables[0];
          highlightLine.push(id);
          const highlightIdx = new Array(expr.length).fill(0).map((_, idx) => idx + 1);
          const exprArray = [expr];
          accDataStructures[callStackName].data.push({ id, expr: exprArray as string[], name, type, highlightIdx });
          arrowTexts.push(code);
        } else {
          (preprocessedCode as VariablesDto).variables.forEach((variable) => {
            if (variable.type.toLowerCase() === "variable") {
              if (typeof variable.expr === "string") {
                (variable as VariableExprArray).expr = variable.expr.split(",");
              }
            } else if (variable.type.toLowerCase() === "list") {
              if (typeof variable.expr === "string") {
                (variable as VariableExprArray).expr = variable.expr.slice(1, -1).split(",");
              }
            } else if (variable.type.toLowerCase() === "tuple") {
              if (typeof variable.expr === "string") {
                (variable as VariableExprArray).expr = variable.expr.slice(1, -1).split(",");
              }
            }
            highlightLine.push(variable.id);
            // 자료구조 시각화에서 화살표에 넣을 코드를 넣는다
            arrowTexts.push(variable.code);
            // 이미 한번 자료구조 시각화에 표현된 name인 경우
            if (usedName[callStackName].includes(variable.name!)) {
              const targetName = variable.name!;

              accDataStructures = updateDataStructure(
                targetName,
                accDataStructures,
                variable as VariableExprArray,
                callStackName
              );
            }
            // 처음 시각화해주는 자료구조인 경우
            else {
              accDataStructures[callStackName].data.push(variable as VariableExprArray);
              usedName[callStackName].push(variable.name!);
            }

            // 코드 흐름 시각화에서 표현된 자료구조 시각화 객체를 삭제하는 부분
            let deletedCodeFlow = deleteCodeFlow(accCodeFlow.objects, variable.id!);
            usedId = usedId.filter((id) => id !== variable.id);
            accCodeFlow = { objects: deletedCodeFlow };
          });
        }
      }
      // 함수 생성으로 새로운 함수 콜스택이 나올 떄
      else if (preprocessedCode.type.toLowerCase() === "createCallStack".toLowerCase()) {
        accDataStructures[(preprocessedCode as CreateCallStackDto).callStackName] = { data: [], isLight: false };
        highlightLine.push((preprocessedCode as CreateCallStackDto).id);

        for (let arg of (preprocessedCode as CreateCallStackDto).args) {
          if (arg.type === "list" || arg.type === "tuple") {
            accDataStructures[(preprocessedCode as CreateCallStackDto).callStackName].data.push({
              expr: arg.expr.slice(1, -1).split(","),
              name: arg.name,
              type: arg.type,
              idx: { start: arg.idx.start, end: arg.idx.end },
            });
          } else if (arg.type === "variable") {
            accDataStructures[(preprocessedCode as CreateCallStackDto).callStackName].data.push({
              expr: arg.expr.split(","),
              name: arg.name,
              type: arg.type,
              idx: { start: arg.idx.start, end: arg.idx.end },
            });
          }
        }
        arrowTexts.push((preprocessedCode as CreateCallStackDto).code);

        accDataStructures[(preprocessedCode as CreateCallStackDto).callStackName].isLight = true;
        usedName[(preprocessedCode as CreateCallStackDto).callStackName] = [];
      }
      // 코드 시각화 부분이 들어왔을 때
      else {
        // ifelseDefine 타입
        if (preprocessedCode.type.toLowerCase() === "ifElseDefine".toLocaleLowerCase()) {
          // ifelseDefine에서 화살표에 넣을 코드를 넣는다
          arrowTexts.push((preprocessedCode as IfElseDto).code);

          highlightLine.push((preprocessedCode as IfElseDto).conditions[0].id);
          // ifelse가 들어왔을 때 한번에 모든 노드의 Light를 다 false로  바꿔주는 함수
          const turnoff = turnOffAllNodeLight(accCodeFlow.objects);

          accCodeFlow = { objects: turnoff };
          for (let condition of (preprocessedCode as IfElseDto).conditions) {
            // ifelse 타입의 객체에 depth를 추가해주는 부분
            const ifElseItem = Object.assign(condition, {
              depth: (preprocessedCode as IfElseDto).depth,
              code: (preprocessedCode as IfElseDto).code,
            });
            // ifelse 타입의 객체를 만들어주는 함수
            const toAddObject = createObjectToAdd(ifElseItem);

            // isLight를 true로 바꿔준다
            toAddObject.isLight = true;
            let finallyCodeFlow: any;

            usedId.push(toAddObject.id);
            if (toAddObject.depth > prevTrackingDepth) {
              finallyCodeFlow = insertIntoDepth(accCodeFlow.objects, toAddObject, prevTrackingId);
            } else if (toAddObject.depth === prevTrackingDepth) {
              finallyCodeFlow = insertEqualToDepth(accCodeFlow.objects, toAddObject, prevTrackingId);
            } else {
              finallyCodeFlow = addCodeFlow(accCodeFlow.objects, toAddObject);
            }

            accCodeFlow = { objects: finallyCodeFlow };

            prevTrackingId = toAddObject.id;
            prevTrackingDepth = toAddObject.depth;
          }
        }
        //그밖의 타입
        else {
          // 그밖의 타입에서 화살표에 넣을 코드를 넣는다

          arrowTexts.push((preprocessedCode as ForDto | PrintDto | IfElseChangeDto | CodeFlowVariableDto).code);
          highlightLine.push((preprocessedCode as ForDto | PrintDto | IfElseChangeDto | CodeFlowVariableDto).id);

          const toAddObject = createObjectToAdd(
            preprocessedCode as ForDto | PrintDto | IfElseChangeDto | CodeFlowVariableDto
          );

          // print 타입일 때 console창의 로그를 만드는 부분
          if ((toAddObject as PrintItem).type === "print") {
            const printObject = toAddObject as PrintItem;
            if (printObject.console !== null) {
              accConsoleLog += printObject.console;
            }
          }
          if ((toAddObject as InputItem).type === "input") {
            const inputObject = toAddObject as InputItem;
            if (inputObject.console !== null) {
              accConsoleLog += inputObject.console;
            }
          }
          if ((toAddObject as CodeFlowVariableItem).type === "variable") {
            const variableObject = toAddObject as CodeFlowVariableItem;
            if (variableObject.console !== undefined) {
              accConsoleLog += variableObject.console;
            }
          }

          // 한번 codeFlow list에 들어가서 수정하는 입력일 때
          if (usedId.includes(toAddObject.id!)) {
            // 한바퀴 돌아서 안에 있는 내용을 초기화해야 하는 부분이면 여기에서 처리해준다
            if (toAddObject.type === "for" || toAddObject.type === "while") {
              const targetChild = findTargetChild(accCodeFlow.objects, toAddObject); // 지워야하는 부분까지 트리를 잘라서 리턴하는 함수
              const idsToDelete = findDeleteUsedId(targetChild); // 지워야하는 부분의 트리를 순회해서  id를 리턴하는 함수
              usedId = usedId.filter((id) => !idsToDelete.includes(id));
              changedCodeFlows = refreshCodeFlow(accCodeFlow.objects, toAddObject); // 반복문 안쪽 child를 초기화해주는 부분
            } else {
              changedCodeFlows = updateCodeFlow(accCodeFlow.objects, toAddObject);
            }
          }
          // 처음 codeFlow list에 들어가서 더해야하는 입력일 때
          else {
            usedId.push(toAddObject.id);
            if (toAddObject.depth > prevTrackingDepth) {
              changedCodeFlows = insertIntoDepth(accCodeFlow.objects, toAddObject, prevTrackingId);
            } else if (toAddObject.depth === prevTrackingDepth) {
              changedCodeFlows = insertEqualToDepth(accCodeFlow.objects, toAddObject, prevTrackingId);
            } else {
              changedCodeFlows = addCodeFlow(accCodeFlow.objects, toAddObject);
            }
          }
          activate = updateActivate(activate, toAddObject);
          const finallyCodeFlow = LightCodeFlow(changedCodeFlows, activate);

          accCodeFlow = { objects: finallyCodeFlow };
          if (
            toAddObject.type !== "variable" &&
            toAddObject.type !== "list" &&
            toAddObject.type !== "tuple" &&
            toAddObject.type !== "input"
          ) {
            prevTrackingDepth = (
              preprocessedCode as ForDto | PrintDto | IfElseChangeDto | CodeFlowVariableDto | WhileDto
            ).depth;
            prevTrackingId = (preprocessedCode as ForDto | PrintDto | IfElseChangeDto | CodeFlowVariableDto | WhileDto)
              .id;
          }
        }
      }

      // 불을 켜줘야하는 자료구조의의 name을 담는 배열
      let toLightStructures: any = {};
      if (preprocessedCode.type.toLowerCase() === "assign".toLowerCase()) {
        (preprocessedCode as VariablesDto).variables?.forEach((element) => {
          const callStackName = (preprocessedCode as VariablesDto).callStackName;
          // ToLightStructures에 키가 없으면 초기화
          if (!toLightStructures[callStackName]) {
            toLightStructures[callStackName] = [];
          }

          toLightStructures[callStackName].push(element.name);
        });
      }
      if (preprocessedCode.type.toLowerCase() === "append".toLowerCase()) {
        const callStackName = (preprocessedCode as AppendDto).callStackName;
        const variable = (preprocessedCode as AppendDto).variable;
        if (variable.type.toLowerCase() === "variable") {
          toLightStructures[callStackName] = [variable.name];
        }
      }
      if (preprocessedCode.type.toLowerCase() === "createCallStack".toLowerCase()) {
        (preprocessedCode as CreateCallStackDto).args?.forEach((element) => {
          const callStackName = (preprocessedCode as CreateCallStackDto).callStackName;
          // ToLightStructures에 키가 없으면 초기화
          if (!toLightStructures[callStackName]) {
            toLightStructures[callStackName] = [];
          }
          toLightStructures[callStackName].push(element.name);
        });
        // 함수 생성시 콜스택이 변수 시각화에 나타나고 코드흐름은 하이라이트를 끄기 위해 사용
        const unLightaccCodeFlow = unLightCodeFlow(accCodeFlow.objects);
        accCodeFlow = { objects: unLightaccCodeFlow };
      }

      const updatedAccDataStructures: WrapperDataStructureItem = Object.entries(accDataStructures).reduce(
        (acc, [key, value]) => {
          acc[key] = {
            data: value.data.map((structure) => ({
              ...structure,
              isLight: toLightStructures[key]?.includes(structure.name) ?? false,
            })),
            isLight: value.isLight,
          };
          return acc;
        },
        {} as WrapperDataStructureItem
      );

      // 자료구조리스트에서 얕은 복사 문제가 생겨서 깊은 복사를 해준다
      const deepCloneStructures = _.cloneDeep(updatedAccDataStructures);

      accDataStructuresList.push(deepCloneStructures);

      const deepClodeCodeFlow = _.cloneDeep(accCodeFlow);
      accCodeFlowList.push(deepClodeCodeFlow);
      accConsoleLogList.push(accConsoleLog);
    }
    setCodeFlowList(accCodeFlowList);
    setStructuresList(accDataStructuresList);
    setConsoleList(accConsoleLogList);
    setCodeFlowLength(accCodeFlowList.length);
    setArrowTextList(arrowTexts);
    setHighlightLines(highlightLine);
  }, [preprocessedCodes]);

  return (
    <>
      <CustomAlert />
      <div id="split-2" ref={rightSectionRef} style={{ display: "flex", flexDirection: "column", flex: "1" }}>
        <div className={styles["top-bar"]}>
          <p className={styles["view-section-title"]}>시각화</p>
          <div className={styles["play-wrap"]}>
            <form onSubmit={handleSubmit}>
              <div
                ref={visualizeButtonRef}
                className={`tutorial-button ${onboardingStep[1] ? "active" : ""}`}
                style={{ position: "relative" }}
              >
                <button
                  type="submit"
                  className={`${styles["view-btn"]} ${codeVizMutation.isPending ? styles["view-btn-loading"] : ""}`}
                  disabled={codeVizMutation.isPending} // 로딩 중에는 버튼 비활성화
                >
                  <img src="/image/icon_play_w.svg" alt="" />
                  시각화
                </button>
              </div>
            </form>
            <div className="flex items-center gap-4">
              <div
                ref={ResultButtonRef}
                className={`tutorial-button ${onboardingStep[2] ? "active" : ""}`}
                style={{ position: "relative" }}
              >
                <button
                  type="button"
                  className={`${styles["playcode-btn"]} ${
                    codeExecMutation.isPending ? styles["playcode-btn-loading"] : ""
                  }`}
                  onClick={handleRunCode}
                  disabled={codeExecMutation.isPending} // 로딩 중에는 버튼 비활성화
                >
                  <img src="/image/icon_play_w.svg" alt="" />
                  결과보기
                </button>
              </div>
            </div>
            <div>
              <div
                ref={visualizeController}
                className={`controller tutorial-button ${onboardingStep[3] ? "active" : ""} `}
              >
                <button>
                  <img src="/image/icon_play_back.svg" onClick={onBack} alt="뒤로" />
                </button>
                <button className="ml8">
                  {isPlaying ? (
                    <img src="/image/icon_play_stop.svg" onClick={onPlay} alt="일시정지" />
                  ) : (
                    <img src="/image/icon_play.svg" onClick={onPlay} alt="재생" />
                  )}
                </button>

                <button className="ml8" onClick={onForward}>
                  <img src="/image/icon_play_next.svg" alt="다음" />
                </button>
              </div>
              <p className="ml14 fz14">
                ({consoleIdx}/{codeFlowLength - 1 == -1 ? 0 : codeFlowLength - 1})
              </p>
              <div ref={speedButton} className={`controller tutorial-button ${onboardingStep[4] ? "active" : ""} `}>
                <p className="ml24 fz14">Play Speed</p>
                <select name="" id="" className="s__select ml14" value={selectedValue} onChange={handleChange}>
                  <option value="0.5x">0.5X</option>
                  <option value="1x">1X</option>
                  <option value="2x">2X</option>
                  <option value="3x">3X</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <Arrow code={arrowTextList[stepIdx]} />
        <Split
          sizes={[50, 50]}
          minSize={100}
          expandToMin={false}
          gutterSize={10}
          gutterAlign="center"
          snapOffset={30}
          dragInterval={1}
          direction="horizontal"
          cursor="col-resize"
          style={{ display: "flex", flexDirection: "row", height: "100%", flex: 1, overflow: "hidden" }}
          className="split-container"
        >
          <div id="split-2-1" className="view-section2-1">
            <div className="view-data" onScroll={handleScrollCodeFlow}>
              <p className="data-name">코드흐름</p>
              <div style={{ width: "600px", display: "flex", flexDirection: "column", flex: 1 }}>
                {codeFlowList?.length > 0 &&
                  stepIdx >= 0 &&
                  renderingCodeFlow(codeFlowList[stepIdx].objects[0].child, width, height, codeFlowScrollTop)}
              </div>
            </div>
          </div>
          <div id="split-2-2" className="view-section2-2" ref={rightSection2Ref}>
            <div className="view-data" onScroll={handleScrollStructures}>
              <p className="data-name">콜스택</p>
              <ul className="var-list">
                {StructuresList?.length > 0 &&
                  stepIdx >= 0 &&
                  renderingStructure(StructuresList[stepIdx], width, height, structuresScrollTop)}
              </ul>
            </div>
          </div>
        </Split>
      </div>
    </>
  );
};

export default RightSection;
