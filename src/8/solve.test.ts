import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { parse, type Puzzle, log } from "../puzzle.ts";

const FILE_PATH = "./src/8/input.txt";
const GOLD_A = 21;
const GOLD_B = 1;
const TEST_INPUT = `30373
25512
65332
33549
35390`;

function isvisible(x: number, y: number, M: number[][]) {
  const szY = M.length;
  const szX = M[0].length;

  const h = M[y][x];
  const row = M[y];
  const left = row.slice(0, x);
  const right = row.slice(x + 1);
  const seenFromLeft = left.every((x) => x < h) || left.length < 1;
  const seenFromRight = right.every((x) => x < h) || right.length < 1;

  //log({ h, left, right, seenFromLeft, seenFromRight });

  const col = M.map((row) => row[x]);
  log({ col });
  const top = col.slice(0, y);
  const bot = col.slice(y + 1);
  log({ x, y, bot });
  const seenFromTop = top.every((x) => x < h) || top.length < 1;
  const seenFromBot = bot.every((x) => x < h) || bot.length < 1;

  //log({ h, top, bot, seenFromTop, seenFromBot });

  if (seenFromLeft || seenFromRight || seenFromTop || seenFromBot) {
    //log({ x, y, h, seenFromLeft, seenFromRight, seenFromTop, seenFromBot });
    return true;
  }

  /*
  for (let i = 0; i < szX; i++) {
    //from top
    for (let j = 0; j < y; j++) {
      if (M[j][i]! >= h) return false;
    }
    //from bottom
    for (let j = szY - 1; j >= y; j--) {
      //log("LALAL M[j][i]", M[j][i]);
      if (M[j][i]! >= h) return false;
    }
  }
  log("visible: x,y", x, y);
  */
  return false;
}

function solve_a(puzzle: Puzzle) {
  const M = puzzle.input
    .trim()
    .split("\n")
    .map((x) => x.split("").map(parseFloat));

  //log({ M });
  //log("M[0]", M[0]);
  let sum = 0;

  for (let y = 0; y < M.length; y++) {
    for (let x = 0; x < M[0].length; x++) {
      if (isvisible(x, y, M)) {
        sum += 1;
      }
    }
  }

  return sum;
}

function solve_b(puzzle: Puzzle) {
  const res = 0;
  return res;
}

Deno.test("A", async () => {
  const testpuzzle = await parse({ input: TEST_INPUT });
  const res = solve_a(testpuzzle);
  log("A RESULT", solve_a(await parse({ filepath: FILE_PATH })));
  assertEquals(res, GOLD_A);
});

/*
Deno.test("B", async () => {
  const testpuzzle = await parse({ input: TEST_INPUT });
  const res = solve_b(testpuzzle);
  log("B RESULT", solve_b(await parse({ filepath: FILE_PATH })));
  assertEquals(res, GOLD_B);
});
*/
