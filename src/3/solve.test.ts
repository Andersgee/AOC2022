import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { parse, type Puzzle, log } from "../puzzle.ts";

const FILE_PATH = "./src/3/input.txt";
const GOLD_A = 157;
const GOLD_B = 70;
const TEST_INPUT = `
vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw
`;

function prioritynumberFromChar(s: string) {
  const asciinumber = s.charCodeAt(0);
  return asciinumber >= 97 ? asciinumber - 97 + 1 : asciinumber - 65 + 27;
}

function solve_a(puzzle: Puzzle) {
  let res = 0;
  for (const row of puzzle.blocks[0]) {
    const items = row[0];
    const len = items.length * 0.5;
    const left = items.slice(0, len);
    const right = items.slice(len);

    let shared = "";
    for (const char of left) {
      if (right.includes(char)) {
        shared = char;
      }
    }

    const priority = prioritynumberFromChar(shared);

    res += priority;
  }

  return res;
}

function solve_b(puzzle: Puzzle) {
  let sum = 0;

  const entries = puzzle.blocks[0];
  const chunkSize = 3;
  for (let i = 0; i < entries.length; i += chunkSize) {
    const chunk = entries.slice(i, i + chunkSize);
    const a = chunk[0][0];
    const b = chunk[1][0];
    const c = chunk[2][0];

    const shared = [];

    for (const char of a) {
      if (b.includes(char)) {
        shared.push(char);
      }
    }

    const shared2 = [];
    for (const char of shared) {
      if (c.includes(char)) {
        shared2.push(char);
      }
    }

    const num = prioritynumberFromChar(shared2[0]);
    sum += num;
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
