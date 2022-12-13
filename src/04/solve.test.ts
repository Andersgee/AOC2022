import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { parse, type Puzzle, log } from "../puzzle.ts";

const FILE_PATH = "./src/04/input.txt";
const GOLD_A = 2;
const GOLD_B = 4;
const TEST_INPUT = `
2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8
`;

function isBetween(x: number, a: number, b: number) {
  return x >= a && x <= b;
}

function solve_a(puzzle: Puzzle) {
  let res = 0;
  for (const pair of puzzle.blocks[0]) {
    const a = pair[0].split("-").map(parseFloat);
    const b = pair[1].split("-").map(parseFloat);

    const a_min = a[0];
    const a_max = a[1];

    const b_min = b[0];
    const b_max = b[1];

    if (isBetween(a_min, b_min, b_max) && isBetween(a_max, b_min, b_max)) {
      res += 1;
      continue;
    }

    if (isBetween(b_min, a_min, a_max) && isBetween(b_max, a_min, a_max)) {
      res += 1;
      continue;
    }
  }

  return res;
}

function solve_b(puzzle: Puzzle) {
  let res = 0;
  for (const pair of puzzle.blocks[0]) {
    const a = pair[0].split("-").map(parseFloat);
    const b = pair[1].split("-").map(parseFloat);

    const a_min = a[0];
    const a_max = a[1];

    const b_min = b[0];
    const b_max = b[1];

    if (isBetween(a_min, b_min, b_max) || isBetween(a_max, b_min, b_max)) {
      res += 1;
      continue;
    }

    if (isBetween(b_min, a_min, a_max) || isBetween(b_max, a_min, a_max)) {
      res += 1;
      continue;
    }
  }

  return res;
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
