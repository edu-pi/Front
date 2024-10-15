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
    callStack: "main",
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
    args: [
      {
        expr: "22",
        name: "name",
        type: "variable",
      },
      {
        expr: "010-3042",
        name: "phoneNumber",
        type: "variable",
      },
    ],
    callStackName: "isEven",
    code: "result=isEven(name)",
    type: "createCallStack",
  },
];

export default UDFResPiece;
