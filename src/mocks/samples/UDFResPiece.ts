const UDFResPiece = [
  {
    //1. 함수 선언 부분
    variables: [
      {
        id: 1,
        expr: "isEven(num)",
        name: "isEven",
        code: "result=isEven(22)",
        type: "function",
      },
    ],
    callStackName: "main",
    type: "assign",
  },
  //2. 함수 호출 부분
  {
    // 왼쪽 코드흐름 - 함수 만드는 부분
    id: 1, // 호출하는 라인 번호
    assignName: "result", // 함숭리턴값을 할당하는 변수, 없으면 ""
    signature: "isEven(name)",
    depth: 2,
    code: "result=isEven(name)",
    type: "callUserFunc",
  },
  {
    // 오른쪽 변수 부분
    // isEven 콜스택 만드는 부분
    args: [],
    callStackName: "isEven",
    code: "result=isEven(name)",
    type: "createCallStack",
  },
  {
    // 왼쪽 코드 흐름
    id: 2,
    name: "c",
    depth: 3,
    code: "c=2",
    expr: "2",
    type: "variable",
  },
  {
    variables: [
      {
        id: 2,
        expr: "2",
        name: "c",
        code: "c=2",
        type: "variable",
      },
    ],
    callStackName: "isEven",
    type: "assign",
  },
  {
    id: 5,
    returnExpr: "True",
    code: "return True",
    depth: 3,
    type: "return",
  },
  {
    id: 5,
    depth: 1,
    returnExpr: "True", // 반환값이 없으면 빈문자열
    returnArgName: "result",
    code: "return True",
    delFuncName: "isEven",
    delFuncId: 1,
    type: "endUserFunc",
  },
  {
    variables: [
      {
        id: 5,
        expr: "True",
        name: "result",
        code: "result=isEven(22)",
        type: "variable",
      },
    ],
    callStackName: "main",
    type: "assign",
  },
];

export default UDFResPiece;
