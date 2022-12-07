import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { parse, type Puzzle, log } from "../puzzle.ts";

const FILE_PATH = "./src/7/input.txt";
const GOLD_A = 95437;
const GOLD_B = 24933642;
const TEST_INPUT = `$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k
`;

type Cmd = "cd" | "ls";

function solve_a(puzzle: Puzzle) {
  const folderSizes: Record<string, number> = {};

  const blocks = puzzle.input
    .split("$")
    .map((s) => s.trim())
    .slice(1);

  let pwd: string[] = [];
  for (const block of blocks) {
    const rows = block.split("\n");
    const [cmd, arg] = rows[0].split(" ");
    const outputlines = rows.slice(1);
    //log({ cmd, arg, results });
    if (cmd === "cd") {
      if (arg === "/") {
        pwd = [];
      } else if (arg === "..") {
        pwd = pwd.slice(0, -1);
      } else {
        pwd.push(arg);
      }
    } else if (cmd === "ls") {
      let sumSize = 0;
      for (const line of outputlines) {
        const [left, right] = line.split(" ");
        if (left !== "dir") {
          const size = parseFloat(left);
          sumSize += size;
        }
      }

      //add size to this folder and parent folders
      for (let i = 0; i < pwd.length; i++) {
        const folder = pwd.slice(0, i + 1);
        const name = `/${folder.join("/")}`;

        if (folderSizes[name] !== undefined) {
          folderSizes[name] += sumSize;
        } else {
          folderSizes[name] = sumSize;
        }
      }
      //folderSizes[`/${pwd.join("/")}`] = sumSize;
    }
  }
  //log({ folderSizes });
  const MAX_SIZE = 100000;
  let res = 0;
  for (const [name, size] of Object.entries(folderSizes)) {
    if (size <= MAX_SIZE) {
      res += size;
    }
  }

  return res;
}

function solve_b(puzzle: Puzzle) {
  const folderSizes: Record<string, number> = {};

  const blocks = puzzle.input
    .split("$")
    .map((s) => s.trim())
    .slice(1);

  let pwd: string[] = [];
  for (const block of blocks) {
    const rows = block.split("\n");
    const [cmd, arg] = rows[0].split(" ");
    const outputlines = rows.slice(1);
    //log({ cmd, arg, results });
    if (cmd === "cd") {
      if (arg === "/") {
        pwd = [""];
      } else if (arg === "..") {
        pwd = pwd.slice(0, -1);
      } else {
        pwd.push(arg);
      }
    } else if (cmd === "ls") {
      let sumSize = 0;
      for (const line of outputlines) {
        const [left, right] = line.split(" ");
        if (left !== "dir") {
          const size = parseFloat(left);
          sumSize += size;
        }
      }

      //add size to this folder and parent folders
      for (let i = 0; i < pwd.length; i++) {
        const folder = pwd.slice(0, i + 1);
        const name = `${folder.join("/")}`;

        if (folderSizes[name] !== undefined) {
          folderSizes[name] += sumSize;
        } else {
          folderSizes[name] = sumSize;
        }
      }
      //folderSizes[`/${pwd.join("/")}`] = sumSize;
    }
  }

  const SYSTEM_SIZE = 70000000;
  const REQUIRED_FREE = 30000000;
  const current_free = SYSTEM_SIZE - folderSizes[""];

  const required_deletion = REQUIRED_FREE - current_free;
  //log({ folderSizes, current_free, required_deletion });

  //pick the smallest folder that is larget than required_deletion

  let potential_folders = [];
  for (const [name, size] of Object.entries(folderSizes)) {
    if (size >= required_deletion) {
      potential_folders.push({ name, size });
    }
  }
  let smallest_size = Infinity;
  for (const potential of potential_folders) {
    if (potential.size < smallest_size) {
      smallest_size = potential.size;
    }
  }
  //log({ potential_folders, smallest_size });

  return smallest_size;
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
