import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { parse, type Puzzle, log, copy } from "../puzzle.ts";

const FILE_PATH = "./src/9/input.txt";
const GOLD_A = 13;
const GOLD_B = 1;
const TEST_INPUT = `R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2
`;

type Cmd = {
  dir: "R" | "L" | "U" | "D";
  count: number;
};

type Coord = [x: number, y: number];

function processCommand(
  dir: Cmd["dir"],
  currentHead: Coord,
  currentTail: Coord
) {
  const newHead = copy<Coord>(currentHead);
  const newTail = copy<Coord>(currentTail);
  if (dir === "R") {
    newHead[0] += 1;
  } else if (dir === "L") {
    newHead[0] -= 1;
  } else if (dir === "U") {
    newHead[1] += 1;
  } else if (dir === "D") {
    newHead[1] -= 1;
  }

  //x
  if (newHead[0] - newTail[0] > 1) {
    const dy = newHead[1] - newTail[1];
    newTail[1] += dy;
    newTail[0] += 1;
  } else if (newHead[0] - newTail[0] < -1) {
    const dy = newHead[1] - newTail[1];
    newTail[1] += dy;
    newTail[0] -= 1;
  }

  //y
  if (newHead[1] - newTail[1] > 1) {
    const dx = newHead[0] - newTail[0];
    newTail[0] += dx;
    newTail[1] += 1;
  } else if (newHead[1] - newTail[1] < -1) {
    const dx = newHead[0] - newTail[0];
    newTail[0] += dx;
    newTail[1] -= 1;
  }

  //log({ newHead, newTail });

  return { newHead, newTail };
}

function solve_a(puzzle: Puzzle) {
  const cmds: Cmd[] = puzzle.blocks[0].map((r) => ({
    dir: r[0] as "R" | "L" | "U" | "D",
    count: parseFloat(r[1]),
  }));

  const tailVisited = new Set<string>();
  let currentHead: Coord = [0, 0];
  let currentTail: Coord = [0, 0];
  for (const cmd of cmds) {
    for (let i = 0; i < cmd.count; i++) {
      const { newHead, newTail } = processCommand(
        cmd.dir,
        currentHead,
        currentTail
      );
      currentHead = newHead;
      currentTail = newTail;
      tailVisited.add(`${newTail[0]}-${newTail[1]}`);
    }
  }
  log({ tailVisited });

  return tailVisited.size;
}

function solve_b(puzzle: Puzzle) {
  const res = 0;
  return res;
}

Deno.test("A", async () => {
  const testpuzzle = await parse({ input: TEST_INPUT });
  const res = solve_a(testpuzzle);
  assertEquals(res, GOLD_A);
  log("A RESULT", solve_a(await parse({ filepath: FILE_PATH })));
});

/*
Deno.test("B", async () => {
  const testpuzzle = await parse({ input: TEST_INPUT });
  const res = solve_b(testpuzzle);
  assertEquals(res, GOLD_B);
  log("B RESULT", solve_b(await parse({ filepath: FILE_PATH })));
});
*/
