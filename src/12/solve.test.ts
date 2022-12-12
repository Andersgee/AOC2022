import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { parse, type Puzzle, log } from "../puzzle.ts";

const FILE_PATH = "./src/12/input.txt";
const GOLD_A = 31;
const GOLD_B = 29;
const TEST_INPUT = `Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi
`;

type Graph = Map<string, string[]>;

function canMoveTo(from: string, to: string) {
  if (from === "S") {
    return true;
  }
  if (to === "E") {
    //wierd problem description... but this passes
    return from === "z" || from === "y" ? true : false;
  }

  return to.charCodeAt(0) - from.charCodeAt(0) <= 1;
}

function str(x: number, y: number) {
  return `${x}-${y}`;
}

function parseMap(puzzle: Puzzle) {
  const charMap = puzzle.entries.map((row) => row.split(""));
  const Y = charMap.length;
  const X = charMap[0].length;
  let S = "";
  let E = "";
  for (let y = 0; y < Y; y++) {
    for (let x = 0; x < X; x++) {
      if (charMap[y][x] === "S") {
        S = str(x, y);
      }
      if (charMap[y][x] === "E") {
        E = str(x, y);
      }
    }
  }
  //log({ charMap });

  const G: Graph = new Map();
  for (let y = 0; y < Y; y++) {
    for (let x = 0; x < X; x++) {
      const nodeName = str(x, y);
      const isStart = charMap[y][x] === "S";

      const neighbors = [];

      if (
        x < X - 1 &&
        (isStart || canMoveTo(charMap[y][x], charMap[y][x + 1]))
      ) {
        neighbors.push({
          x: x + 1,
          y: y,
          char: charMap[y][x + 1],
        });
        //edges.push(str(x + 1, y)); //right
      }
      if (x > 0 && (isStart || canMoveTo(charMap[y][x], charMap[y][x - 1]))) {
        neighbors.push({
          x: x - 1,
          y: y,
          char: charMap[y][x - 1],
        });
        //edges.push(str(x - 1, y)); //left
      }
      if (
        y < Y - 1 &&
        (isStart || canMoveTo(charMap[y][x], charMap[y + 1][x]))
      ) {
        neighbors.push({
          x: x,
          y: y + 1,
          char: charMap[y + 1][x],
        });
        //edges.push(str(x, y + 1)); //down
      }
      if (y > 0 && (isStart || canMoveTo(charMap[y][x], charMap[y - 1][x]))) {
        neighbors.push({
          x: x,
          y: y - 1,
          char: charMap[y - 1][x],
        });
        //edges.push(str(x, y - 1)); //up
      }

      const sortedNeighbors = neighbors.sort(
        (a, b) => b.char.charCodeAt(0) - a.char.charCodeAt(0)
      );
      const edges = sortedNeighbors.map((neighbor) =>
        str(neighbor.x, neighbor.y)
      );
      G.set(nodeName, edges);
    }
  }

  return { G, Y, X, S, E, charMap };
}

type Prev = Map<string, string>;

function solveGraph(G: Graph, src: string, dest: string) {
  const visited = new Set([src]);

  const prev: Prev = new Map();

  const q = [src];
  while (q.length > 0) {
    const node = q.shift(); //take first from q
    if (!node) throw "no node. should never happen";

    const neighbors = G.get(node);
    if (!neighbors) throw "no neighbors for node. should never happen";

    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        q.push(neighbor);
        visited.add(neighbor);
        prev.set(neighbor, node);
      }
    }
    if (node === dest) {
      break;
    }
  }
  return prev;
}

function reconstructPath(prev: Prev, src: string, dest: string) {
  const path = [dest];
  let node = dest;
  while (node !== src) {
    const parent = prev.get(node);
    if (!parent) throw "no parent";

    path.unshift(parent); //push first
    node = parent;
  }
  return path;
}

function solve_a(puzzle: Puzzle) {
  const { G, S, E, X, Y } = parseMap(puzzle);
  const prev = solveGraph(G, S, E);
  //log({ G, S, E, prev });

  const path = reconstructPath(prev, S, E);
  //log({ path });
  //drawPath(path, X, Y);
  const nSteps = path.length - 1;
  return nSteps;
}

function solve_b(puzzle: Puzzle) {
  const { G, S, E, X, Y, charMap } = parseMap(puzzle);

  //log({ G, S, E, prev });
  const starts: string[] = [];
  for (const [node, neighbors] of G) {
    const [x, y] = node.split("-").map(parseFloat);
    if (charMap[y][x] === "a") {
      starts.push(node);
    }
  }

  const lengths: Map<string, number> = new Map();
  for (const start of starts) {
    try {
      const prev = solveGraph(G, start, E);
      const path = reconstructPath(prev, start, E);
      lengths.set(start, path.length - 1);
    } catch (error) {
      //console.log(`catch on start:${start},  ${JSON.stringify(error)}`);
    }
  }
  //log({ lengths });

  let shortestLen = Infinity;
  for (const [node, l] of lengths) {
    if (l < shortestLen) {
      shortestLen = l;
    }
  }

  return shortestLen;
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

function drawPath(path: string[], X: number, Y: number) {
  const s: string[][] = [];
  for (let y = 0; y < Y; y++) {
    s.push([]);
    for (let x = 0; x < X; x++) {
      s[y].push(".");
    }
  }

  for (let i = 0; i < path.length - 1; i++) {
    const [x, y] = path[i].split("-").map(parseFloat);
    const [x_next, y_next] = path[i + 1].split("-").map(parseFloat);

    let symbol = "X";
    if (x_next > x) {
      symbol = ">";
    } else if (x_next < x) {
      symbol = "<";
    } else if (y_next > y) {
      symbol = "v";
    } else if (y_next < y) {
      symbol = "^";
    } else {
      throw `BAD SYMBOL x:${x}, y:${y}, x_next:${x_next}, y_next:${y_next}`;
    }
    //s[y][x] = `${i % 10}`;
    s[y][x] = symbol;
  }
  const display = s.map((row) => row.join(""));
  display.forEach((d) => console.log(d));
  return s;
}
