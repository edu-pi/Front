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
];

export default UDFResPiece;
