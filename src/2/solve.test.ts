import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { parse, type Puzzle, log } from "../puzzle.ts";

const FILE_PATH = "./src/2/input.txt";
const GOLD_A = 15;
const GOLD_B = 12;
const TEST_INPUT = `
A Y
B X
C Z
`;

function translate(s: string) {
  if (s === "A" || s === "X") return "rock";
  if (s === "B" || s === "Y") return "paper";
  if (s === "C" || s === "Z") return "scissor";

  throw "bad translate";
}

type Action = "rock" | "paper" | "scissor";

function getPoints(opponent: Action, me: Action) {
  if (opponent === "rock" && me === "rock") return 3 + 1;
  if (opponent === "rock" && me === "paper") return 6 + 2;
  if (opponent === "rock" && me === "scissor") return 0 + 3;

  if (opponent === "paper" && me === "paper") return 3 + 2;
  if (opponent === "paper" && me === "rock") return 0 + 1;
  if (opponent === "paper" && me === "scissor") return 6 + 3;

  if (opponent === "scissor" && me === "scissor") return 3 + 3;
  if (opponent === "scissor" && me === "rock") return 6 + 1;
  if (opponent === "scissor" && me === "paper") return 0 + 2;

  throw "MISSING CONDITION";
}

function solve_a(puzzle: Puzzle) {
  let sum = 0;
  for (const row of puzzle.blocks[0]) {
    const opponent = translate(row[0]);
    const me = translate(row[1]);
    sum += getPoints(opponent, me);
  }
  return sum;
}

function translate2(s: string) {
  if (s === "X") return "loss";
  if (s === "Y") return "draw";
  if (s === "Z") return "win";

  throw "bad translate2";
}

function getPoints2(opponent: Action, desiredResult: "loss" | "draw" | "win") {
  if (opponent === "rock" && desiredResult === "loss") return 0 + 3;
  if (opponent === "rock" && desiredResult === "draw") return 3 + 1;
  if (opponent === "rock" && desiredResult === "win") return 6 + 2;

  if (opponent === "paper" && desiredResult === "loss") return 0 + 1;
  if (opponent === "paper" && desiredResult === "draw") return 3 + 2;
  if (opponent === "paper" && desiredResult === "win") return 6 + 3;

  if (opponent === "scissor" && desiredResult === "loss") return 0 + 2;
  if (opponent === "scissor" && desiredResult === "draw") return 3 + 3;
  if (opponent === "scissor" && desiredResult === "win") return 6 + 1;

  throw "MISSING CONDITION";
}

function solve_b(puzzle: Puzzle) {
  let sum = 0;
  for (const row of puzzle.blocks[0]) {
    const opponent = translate(row[0]);
    const desired = translate2(row[1]);
    sum += getPoints2(opponent, desired);
  }
  return sum;
}

Deno.test("A", async () => {
  const testpuzzle = await parse({ input: TEST_INPUT });
  const res = solve_a(testpuzzle);
  log("A RESULT", solve_a(await parse({ filepath: FILE_PATH })));
  assertEquals(GOLD_A, res);
});

Deno.test("B", async () => {
  const testpuzzle = await parse({ input: TEST_INPUT });
  const res = solve_b(testpuzzle);
  log("B RESULT", solve_b(await parse({ filepath: FILE_PATH })));
  assertEquals(GOLD_B, res);
});
