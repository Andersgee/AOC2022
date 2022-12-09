import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { parse, type Puzzle, log, copy } from "../puzzle.ts";

const FILE_PATH = "./src/9/input.txt";
const GOLD_A = 13;
const TEST_INPUT = `R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2
`;

const GOLD_B = 36;
const TEST_INPUTB = `R 5
U 8
L 8
D 3
R 17
D 10
L 25
U 20`;

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

/** make b follow a */
function followCmd(a: Coord, b: Coord): Coord {
  const oldX = b[0];
  const oldY = b[1];
  const x = a[0];
  const y = a[1];
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];

  if (Math.abs(dy) <= 1 && Math.abs(dx) <= 1) return [oldX, oldY];

  if (dy === 0 && dx > 1) return [x - 1, y];
  if (dy === 0 && dx < -1) return [x + 1, y];

  if (dx === 0 && dy > 1) return [x, y - 1];
  if (dx === 0 && dy < -1) return [x, y + 1];

  //
  if (dx === 1 && dy > 1) return [x, y - 1];
  if (dx === 1 && dy < -1) return [x, y + 1];

  if (dx === -1 && dy > 1) return [x, y - 1];
  if (dx === -1 && dy < -1) return [x, y + 1];

  if (dy === 1 && dx > 1) return [x - 1, y];
  if (dy === 1 && dx < -1) return [x + 1, y];

  if (dy === -1 && dx > 1) return [x - 1, y];
  if (dy === -1 && dx < -1) return [x + 1, y];

  if (dx > 1 && dy > 1) return [x - 1, y - 1];
  if (dx > 1 && dy < -1) return [x - 1, y + 1];
  if (dx < -1 && dy > 1) return [x + 1, y - 1];
  if (dx < -1 && dy < -1) return [x + 1, y + 1];

  //dx:2, dy:1

  throw `MISSING FOLLOW CONDITION dx:${dx}, dy:${dy}`;
  return [0, 0];
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

function displayKnots(knots: Coord[]) {
  const M = Array.from({ length: 26 }).map((_) =>
    Array.from({ length: 26 }).map((_) => ".")
  );
  for (let i = 0; i < knots.length; i++) {
    const knot = knots[i];
    const x = knot[0] + 11;
    const y = knot[1] + 5;
    M[y][x] = `${i}`;
  }
  const str = M.reverse()
    .map((row) => row.join(""))
    .join("\n");
  console.log(str);
}

function solve_b(puzzle: Puzzle) {
  const cmds: Cmd[] = puzzle.blocks[0].map((r) => ({
    dir: r[0] as "R" | "L" | "U" | "D",
    count: parseFloat(r[1]),
  }));

  const tailVisited = new Set<string>();
  const currentKnots: Coord[] = [
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
  ];
  for (const cmd of cmds) {
    for (let i = 0; i < cmd.count; i++) {
      const { newHead } = processCommand(
        cmd.dir,
        currentKnots[0],
        currentKnots[1]
      );
      currentKnots[0] = newHead;

      for (let k = 0; k < currentKnots.length - 1; k++) {
        const newB = followCmd(currentKnots[k], currentKnots[k + 1]);
        currentKnots[k + 1] = newB;
      }

      const tailKnotStr = `${currentKnots.at(-1)![0]},${
        currentKnots.at(-1)![1]
      }`;
      tailVisited.add(tailKnotStr);

      //console.log(`\n ${cmd.dir} ${cmd.count}, step${i + 1}`);
      //displayKnots(currentKnots);
    }
    //console.log(`\n ${cmd.dir} ${cmd.count}`);
    //displayKnots(currentKnots);
  }
  //log({ tailVisited });

  return tailVisited.size;
}

/*
Deno.test("A", async () => {
  const testpuzzle = await parse({ input: TEST_INPUT });
  const res = solve_a(testpuzzle);
  assertEquals(res, GOLD_A);
  log("A RESULT", solve_a(await parse({ filepath: FILE_PATH })));
});
*/

Deno.test("B", async () => {
  const testpuzzle = await parse({ input: TEST_INPUTB });
  const res = solve_b(testpuzzle);
  assertEquals(res, GOLD_B);
  log("B RESULT", solve_b(await parse({ filepath: FILE_PATH })));

  //2581 too high.
});
