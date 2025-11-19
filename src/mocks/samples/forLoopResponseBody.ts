// for 루프 시각화 테스트용 응답 데이터
const forLoopResponseBody = [
  {
    id: 1,
    depth: 1,
    condition: {
      target: "i",
      cur: "0",
      start: "0",
      end: "3",
      step: "1",
    },
    highlights: ["target", "cur", "start", "end", "step"],
    code: "for i in range(3):",
    type: "for",
  },
  {
    id: 2,
    depth: 2,
    expr: "1",
    highlights: [0],
    console: "1\n",
    code: "print(1)",
    type: "print",
  },
  {
    id: 1,
    depth: 1,
    condition: {
      target: "i",
      cur: "1",
      start: "0",
      end: "3",
      step: "1",
    },
    highlights: ["cur"],
    code: "for i in range(3):",
    type: "for",
  },
  {
    id: 2,
    depth: 2,
    expr: "1",
    highlights: [0],
    console: "1\n",
    code: "print(1)",
    type: "print",
  },
  {
    id: 1,
    depth: 1,
    condition: {
      target: "i",
      cur: "2",
      start: "0",
      end: "3",
      step: "1",
    },
    highlights: ["cur"],
    code: "for i in range(3):",
    type: "for",
  },
  {
    id: 2,
    depth: 2,
    expr: "1",
    highlights: [0],
    console: "1\n",
    code: "print(1)",
    type: "print",
  },
];

export default forLoopResponseBody;

