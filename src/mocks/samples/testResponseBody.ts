const testResponseBody = [
  {
    variables: [
      {
        id: 2,
        expr: "isEven(number)",
        name: "isEven",
        code: "def isEven(number):",
        type: "function",
      },
    ],
    callStackName: "main",
    type: "assign",
  },
  {
    id: 6,
    assignName: "result",
    depth: 1,
    signature: "isEven(number)",
    code: "result=isEven(22)",
    type: "callUserFunc",
  },
  {
    args: [
      {
        expr: "22",
        name: "number",
        type: "variable",
      },
    ],
    callStackName: "isEven",
    code: "result=isEven(22)",
    type: "createCallStack",
  },
  {
    id: 3,
    depth: 2,
    expr: "1",
    highlights: [0],
    console: "1\n",
    code: "print(1)",
    type: "print",
  },
  {
    id: 4,
    depth: 2,
    returnExpr: "1",
    code: "return 1",
    type: "return",
  },
  {
    id: 6,
    depth: 1,
    returnExpr: "1",
    returnArgName: "result",
    code: "result=isEven(22)",
    delFuncName: "isEven",
    delFuncId: 2,
    type: "endUserFunc",
  },
  {
    variables: [
      {
        id: 6,
        expr: "1",
        name: "result",
        code: "result=isEven(22)",
        type: "variable",
      },
    ],
    callStackName: "main",
    type: "assign",
  },
  {
    id: 7,
    depth: 1,
    expr: "1",
    highlights: [0],
    console: "1\n",
    code: "print(1)",
    type: "print",
  },
];
export default testResponseBody;
