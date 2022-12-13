import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { parse, type Puzzle, log } from "../puzzle.ts";

const FILE_PATH = "./src/01/input.txt";
const GOLD_A = 24000;
const GOLD_B = 45000;
const TEST_INPUT = `
1000
2000
3000

4000

5000
6000

7000
8000
9000

10000
`;

function solve_a(puzzle: Puzzle) {
  const list = puzzle.blocks.map((b) =>
    b
      .flat()
      .map((s) => parseInt(s, 10))
      .reduce((p, x) => p + x)
  );

  return Math.max(...list);
}

function solve_b(puzzle: Puzzle) {
  const list = puzzle.blocks.map((b) =>
    b
      .flat()
      .map((s) => parseInt(s, 10))
      .reduce((p, x) => p + x)
  );

  return list
    .sort()
    .slice(0, 3)
    .reduce((p, x) => p + x);
}

Deno.test("A", async () => {
  const testpuzzle = await parse({ input: TEST_INPUT });
  const res = solve_a(testpuzzle);
  log("A RESULT", solve_a(await parse({ filepath: FILE_PATH })));
  assertEquals(res, GOLD_A);
});

Deno.test("B", async () => {
  const testpuzzle = await parse({ input: TEST_INPUT });
  const res = solve_b(testpuzzle);
  log("B RESULT", solve_b(await parse({ filepath: FILE_PATH })));
  assertEquals(res, GOLD_B);
});
