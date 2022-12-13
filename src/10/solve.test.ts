import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { parse, type Puzzle, log } from "../puzzle.ts";

const FILE_PATH = "./src/10/input.txt";
const GOLD_A = 13140;
const GOLD_B = `##..##..##..##..##..##..##..##..##..##..###...###...###...###...###...###...###.####....####....####....####....####....#####.....#####.....#####.....#####.....######......######......######......###########.......#######.......#######.....`;

const TEST_INPUT = `addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop
`;

function solve_a(puzzle: Puzzle) {
  const lines = puzzle.input.split("\n");

  let x = 1;
  const history: number[] = [];
  for (const line of lines) {
    const [instr, arg] = line.split(" ");
    if (instr === "noop") {
      history.push(x);
    } else if (instr === "addx") {
      const a = parseFloat(arg);
      history.push(x);
      history.push(x);
      x += a;
    }
  }
  let res = 0;
  for (const k of [20, 60, 100, 140, 180, 220]) {
    let h = history[k - 1];
    res += k * h;
  }
  return res;
}

function solve_b(puzzle: Puzzle) {
  const lines = puzzle.input.split("\n");

  let x = 1;
  const history: number[] = [];
  for (const line of lines) {
    const [instr, arg] = line.split(" ");
    if (instr === "noop") {
      history.push(x);
    } else if (instr === "addx") {
      const a = parseFloat(arg);
      history.push(x);
      history.push(x);
      x += a;
    }
  }
  let display = Array.from({ length: 40 * 6 }).map((_) => ".");
  for (let i = 0; i < display.length; i++) {
    if (Math.abs(history[i] - (i % 40)) <= 1) {
      display[i] = "#";
    }
  }
  log(display.slice(0, 40).join(""));
  log(display.slice(40, 80).join(""));
  log(display.slice(80, 120).join(""));
  log(display.slice(120, 160).join(""));
  log(display.slice(160, 200).join(""));
  log(display.slice(200, 240).join(""));
  return display.join("");
}

Deno.test("A", async () => {
  const testpuzzle = await parse({ input: TEST_INPUT });
  const res = solve_a(testpuzzle);
  assertEquals(res, GOLD_A);
  log("A RESULT", solve_a(await parse({ filepath: FILE_PATH })));
});

Deno.test("B", async () => {
  const testpuzzle = await parse({ input: TEST_INPUT });
  const res = solve_b(testpuzzle);
  assertEquals(res, GOLD_B);
  log("B RESULT", solve_b(await parse({ filepath: FILE_PATH })));
});
