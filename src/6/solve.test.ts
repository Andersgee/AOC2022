import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { parse, type Puzzle, log } from "../puzzle.ts";

const FILE_PATH = "./src/6/input.txt";

const TEST_INPUT1 = "mjqjpqmgbljsphdztnvjfqwrcgsmlb";
const GOLD_A1 = 7;

const TEST_INPUT2 = "bvwbjplbgvbhsrlpgdmjqwftvncz";
const GOLD_A2 = 5;

const TEST_INPUT3 = "nppdvjthqldpwncqszvftbrmjlhg";
const GOLD_A3 = 6;

const TEST_INPUT4 = "nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg";
const GOLD_A4 = 10;

const TEST_INPUT5 = "zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw";
const GOLD_A5 = 11;

const GOLD_B1 = 19;
const GOLD_B2 = 23;
const GOLD_B3 = 23;
const GOLD_B4 = 29;
const GOLD_B5 = 26;

function solve_a(puzzle: Puzzle) {
  const chars = puzzle.input.split("");
  for (let i = 0; i < chars.length - 3; i++) {
    const sequence = new Set([
      chars[i],
      chars[i + 1],
      chars[i + 2],
      chars[i + 3],
    ]);
    //log({ i, sequence });

    if (sequence.size === 4) {
      //four characters that are all different
      return i + 4;
    }
  }
}

function solve_b(puzzle: Puzzle) {
  const N = 14;
  const chars = puzzle.input.split("");
  for (let i = 0; i < chars.length - (N - 1); i++) {
    const s = chars.slice(i, i + N);
    const sequence = new Set([...s]);
    //log({ i, sequence });

    if (sequence.size === N) {
      return i + N;
    }
  }
}

Deno.test("A1", async () => {
  const testpuzzle = await parse({ input: TEST_INPUT1 });
  assertEquals(solve_a(testpuzzle), GOLD_A1);
});
Deno.test("A2", async () => {
  const testpuzzle = await parse({ input: TEST_INPUT2 });
  assertEquals(solve_a(testpuzzle), GOLD_A2);
});
Deno.test("A3", async () => {
  const testpuzzle = await parse({ input: TEST_INPUT3 });
  assertEquals(solve_a(testpuzzle), GOLD_A3);
});
Deno.test("A4", async () => {
  const testpuzzle = await parse({ input: TEST_INPUT4 });
  assertEquals(solve_a(testpuzzle), GOLD_A4);
});
Deno.test("A5", async () => {
  const testpuzzle = await parse({ input: TEST_INPUT5 });
  log("A RESULT", solve_a(await parse({ filepath: FILE_PATH })));
  assertEquals(solve_a(testpuzzle), GOLD_A5);
});

Deno.test("B1", async () => {
  const testpuzzle = await parse({ input: TEST_INPUT1 });
  assertEquals(solve_b(testpuzzle), GOLD_B1);
});
Deno.test("B2", async () => {
  const testpuzzle = await parse({ input: TEST_INPUT2 });
  assertEquals(solve_b(testpuzzle), GOLD_B2);
});
Deno.test("B3", async () => {
  const testpuzzle = await parse({ input: TEST_INPUT3 });
  assertEquals(solve_b(testpuzzle), GOLD_B3);
});
Deno.test("B4", async () => {
  const testpuzzle = await parse({ input: TEST_INPUT4 });
  assertEquals(solve_b(testpuzzle), GOLD_B4);
});
Deno.test("B5", async () => {
  const testpuzzle = await parse({ input: TEST_INPUT5 });
  log("B RESULT", solve_b(await parse({ filepath: FILE_PATH })));
  assertEquals(solve_b(testpuzzle), GOLD_B5);
});
