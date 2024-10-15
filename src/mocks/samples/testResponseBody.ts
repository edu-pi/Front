const testResponseBody = [
  {
    id: 2,
    code: "here",
    depth: 1,
    expr: "3",
    type: "variable",
  },
  {
    variables: [
      {
        id: 2,
        code: "here",
        expr: "3",
        name: "a",
        type: "variable",
      },
    ],
    type: "assign",
  },
  {
    id: 3,
    code: "here",
    depth: 1,
    condition: {
      target: "i",
      cur: "0",
      start: "0",
      end: "3",
      step: "1",
    },
    highlights: ["target", "cur", "start", "end", "step"],
    type: "for",
  },
  {
    id: 4,
    code: "here",
    depth: 2,
    expr: "' ' * a - 1 - i",
    highlights: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
    console: null,
    type: "print",
  },
  {
    id: 4,
    code: "here",
    depth: 2,
    expr: "' ' * 3 - 1 - 0",
    highlights: [6, 14],
    console: null,
    type: "print",
  },
  {
    id: 4,
    code: "here",
    depth: 2,
    expr: "' ' * 2 - 0",
    highlights: [6, 10],
    console: null,
    type: "print",
  },
  {
    id: 4,
    code: "here",
    depth: 2,
    expr: "' ' * 2",
    highlights: [],
    console: null,
    type: "print",
  },
  {
    id: 4,
    code: "here",
    depth: 2,
    expr: "'  '",
    highlights: [0, 1, 2, 3],
    console: "'  '",
    type: "print",
  },
  {
    id: 5,
    code: "here",
    depth: 2,
    expr: "'*' * 2 * i + 1",
    highlights: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
    console: null,
    type: "print",
  },
  {
    id: 5,
    code: "here",
    depth: 2,
    expr: "'*' * 2 * 0 + 1",
    highlights: [10],
    console: null,
    type: "print",
  },
  {
    id: 5,
    code: "here",
    depth: 2,
    expr: "'*' * 0 + 1",
    highlights: [6, 8, 10],
    console: null,
    type: "print",
  },
  {
    id: 5,
    code: "here",
    depth: 2,
    expr: "'*' * 1",
    highlights: [6],
    console: null,
    type: "print",
  },
  {
    id: 5,
    code: "here",
    depth: 2,
    expr: "'*'",
    highlights: [0, 1, 2],
    console: "'*'\n",
    type: "print",
  },
  {
    id: 3,
    code: "here",
    depth: 1,
    condition: {
      target: "i",
      cur: "1",
      start: "0",
      end: "3",
      step: "1",
    },
    highlights: ["cur"],
    type: "for",
  },
  {
    id: 4,
    code: "here",
    depth: 2,
    expr: "' ' * a - 1 - i",
    highlights: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
    console: null,
    type: "print",
  },
  {
    id: 4,
    code: "here",
    depth: 2,
    expr: "' ' * 3 - 1 - 1",
    highlights: [6, 14],
    console: null,
    type: "print",
  },
  {
    id: 4,
    code: "here",
    depth: 2,
    expr: "' ' * 2 - 1",
    highlights: [6],
    console: null,
    type: "print",
  },
  {
    id: 4,
    code: "here",
    depth: 2,
    expr: "' ' * 1",
    highlights: [6],
    console: null,
    type: "print",
  },
  {
    id: 4,
    code: "here",
    depth: 2,
    expr: "' '",
    highlights: [0, 1, 2],
    console: "' '",
    type: "print",
  },
  {
    id: 5,
    code: "here",
    depth: 2,
    expr: "'*' * 2 * i + 1",
    highlights: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
    console: null,
    type: "print",
  },
  {
    id: 5,
    code: "here",
    depth: 2,
    expr: "'*' * 2 * 1 + 1",
    highlights: [10],
    console: null,
    type: "print",
  },
  {
    id: 5,
    code: "here",
    depth: 2,
    expr: "'*' * 2 + 1",
    highlights: [8],
    console: null,
    type: "print",
  },
  {
    id: 5,
    code: "here",
    depth: 2,
    expr: "'*' * 3",
    highlights: [6],
    console: null,
    type: "print",
  },
  {
    id: 5,
    code: "here",
    depth: 2,
    expr: "'***'",
    highlights: [0, 1, 2, 3, 4],
    console: "'***'\n",
    type: "print",
  },
  {
    id: 3,
    code: "here",
    depth: 1,
    condition: {
      target: "i",
      cur: "2",
      start: "0",
      end: "3",
      step: "1",
    },
    highlights: ["cur"],
    type: "for",
  },
  {
    id: 4,
    code: "here",
    depth: 2,
    expr: "' ' * a - 1 - i",
    highlights: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
    console: null,
    type: "print",
  },
  {
    id: 4,
    code: "here",
    depth: 2,
    expr: "' ' * 3 - 1 - 2",
    highlights: [6, 14],
    console: null,
    type: "print",
  },
  {
    id: 4,
    code: "here",
    depth: 2,
    expr: "' ' * 2 - 2",
    highlights: [6, 10],
    console: null,
    type: "print",
  },
  {
    id: 4,
    code: "here",
    depth: 2,
    expr: "' ' * 0",
    highlights: [6],
    console: null,
    type: "print",
  },
  {
    id: 4,
    code: "here",
    depth: 2,
    expr: "''",
    highlights: [0, 1],
    console: "''",
    type: "print",
  },
  {
    id: 5,
    code: "here",
    depth: 2,
    expr: "'*' * 2 * i + 1",
    highlights: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
    console: null,
    type: "print",
  },
  {
    id: 5,
    code: "here",
    depth: 2,
    expr: "'*' * 2 * 2 + 1",
    highlights: [10],
    console: null,
    type: "print",
  },
  {
    id: 5,
    code: "here",
    depth: 2,
    expr: "'*' * 4 + 1",
    highlights: [6, 8, 10],
    console: null,
    type: "print",
  },
  {
    id: 5,
    code: "here",
    depth: 2,
    expr: "'*' * 5",
    highlights: [6],
    console: null,
    type: "print",
  },
  {
    id: 5,
    code: "here",
    depth: 2,
    expr: "'*****'",
    highlights: [0, 1, 2, 3, 4, 5, 6],
    console: "'*****'\n",
    type: "print",
  },
];

export default testResponseBody;