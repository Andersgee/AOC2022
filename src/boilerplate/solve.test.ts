import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { parse, type Puzzle, log } from "../puzzle.ts";

const FILE_PATH = "./src/1/input.txt";
const GOLD_A = 1;
const GOLD_B = 1;
const TEST_INPUT = `

`;

function solve_a(puzzle: Puzzle) {
  const res = 0;
  return res;
}

function solve_b(puzzle: Puzzle) {
  const res = 0;
  return res;
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
