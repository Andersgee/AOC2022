import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { parse, type Puzzle, log } from "../puzzle.ts";

const FILE_PATH = "./src/5/input.txt";
const GOLD_A = "CMZ";
const GOLD_B = "";
const TEST_INPUT = `
    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2
`;

const TEST_STACKS = [["Z", "N"], ["M", "C", "D"], ["P"]];

const STACKS = [
  ["Z", "J", "G"],
  ["Q", "L", "R", "P", "W", "F", "V", "C"],
  ["F", "P", "M", "C", "L", "G", "R"],
  ["L", "F", "B", "W", "P", "H", "M"],
  ["G", "C", "F", "S", "V", "Q"],
  ["W", "H", "J", "Z", "M", "Q", "T", "L"],
  ["H", "F", "S", "B", "V"],
  ["F", "J", "Z", "S"],
  ["M", "C", "D", "P", "F", "H", "B", "T"],
];

type Move = {
  from: number;
  to: number;
  repeatCount: number;
};

type Stack = string[];

function execute(move: Move, stacks: Stack[]) {
  for (let i = 0; i < move.repeatCount; i++) {
    log("moving", { move });
    const item = stacks[move.from].pop();
    if (!item) throw "no item to pop";
    stacks[move.to].push(item);
  }
}

function solve_a(puzzle: Puzzle, stacks: Stack[]) {
  const commands = puzzle.blocks[1];
  const moves: Move[] = commands.map((x) => ({
    from: parseFloat(x[3]) - 1,
    to: parseFloat(x[5]) - 1,
    repeatCount: parseFloat(x[1]),
  }));

  for (const move of moves) {
    execute(move, stacks);
  }

  const res = stacks.map((stack) => stack.at(-1)).join("");
  return res;
}

function solve_b(puzzle: Puzzle) {
  const res = "";
  return "";
}

Deno.test("A", async () => {
  const testpuzzle = await parse({ input: TEST_INPUT });
  const res = solve_a(testpuzzle, TEST_STACKS);
  log("A RESULT", solve_a(await parse({ filepath: FILE_PATH }), STACKS));
  assertEquals(res, GOLD_A);
});

/*
Deno.test("B", async () => {
  const testpuzzle = await parse({ input: TEST_INPUT });
  const res = solve_b(testpuzzle);
  log("B RESULT", solve_b(await parse({ filepath: FILE_PATH })));
  assertEquals(GOLD_B, res);
});
*/
