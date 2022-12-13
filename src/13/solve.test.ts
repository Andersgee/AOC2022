import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { parse, type Puzzle, log } from "../puzzle.ts";

const FILE_PATH = "./src/13/input.txt";
const GOLD_A = 13;
const GOLD_B = 1;
const TEST_INPUT = `[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]
`;

type Packet = number | Packet[];

function isRightOrder(left: Packet, right: Packet) {
  const { correct, inCorrect } = compare(left, right);
  return correct;
}

function compare(
  left: Packet,
  right: Packet
): { correct: boolean; inCorrect: boolean } {
  log(`Compare ${JSON.stringify(left)} vs ${JSON.stringify(right)}`);
  if (typeof left === "number") {
    if (typeof right === "number") {
      const correct = left < right;
      const inCorrect = right < left;
      log(
        `both numbers. correct:${JSON.stringify(
          correct
        )}, inCorrect:${JSON.stringify(inCorrect)}`
      );
      return { correct, inCorrect };
    } else {
      //left is number but right is not
      return compare([left], right);
    }
  } else {
    if (typeof right === "number") {
      //right is number but left is not
      return compare(left, [right]);
    } else {
      //bot are lists, compare each element
      const N = Math.max(left.length, right.length);

      //log(`comparing lists: ${JSON.stringify(left)} vs ${JSON.stringify(right)}`);
      for (let i = 0; i < N; i++) {
        if (left[i] === undefined && right[i] !== undefined) {
          log(
            `left ran out at index:${i} while doing ${JSON.stringify(
              left
            )} vs ${JSON.stringify(right)}`
          );
          return { correct: true, inCorrect: false };
        }

        if (left[i] !== undefined && right[i] === undefined) {
          log(
            `right ran out at index:${i} while doing ${JSON.stringify(
              left
            )} vs ${JSON.stringify(right)}`
          );
          return { correct: false, inCorrect: true };
        }

        if (left[i] === undefined && right[i] === undefined) {
          throw "left and right both undefined. THIS SHOULD NEVER HAPPEN";
        }

        const { correct, inCorrect } = compare(left[i], right[i]);
        if (!correct && !inCorrect) {
          continue;
        }

        if (correct) {
          return { correct: true, inCorrect: false };
        } else if (inCorrect) {
          return { correct: false, inCorrect: true };
        } else {
          continue;
        }
      }

      log("FALLBACK RETURN false,false... SHOULD NOT HAPPEN?");
      return { correct: false, inCorrect: false };
    }
  }
}

type Pair = { left: Packet; right: Packet };

function solve_a(puzzle: Puzzle) {
  const pairs = puzzle.input.split("\n\n").map((p) => {
    const [a, b] = p.split("\n");
    log({ a, b });

    const pair: Pair = {
      left: JSON.parse(a),
      right: JSON.parse(b),
    };
    return pair;
  });

  const correctPairsIndexes: number[] = [];
  for (let i = 0; i < pairs.length; i++) {
    if (isRightOrder(pairs[i].left, pairs[i].right)) {
      correctPairsIndexes.push(i + 1);
    }
  }

  const res = correctPairsIndexes.reduce((a, b) => a + b);
  return res;
}
/*
Deno.test("Pair 1", () => {
  const left = [1, 1, 3, 1, 1];
  const right = [1, 1, 5, 1, 1];
  const res = isRightOrder(left, right);
  assertEquals(res, true);
});

Deno.test("Pair 2", () => {
  const left = [[1], [2, 3, 4]];
  const right = [[1], 4];
  const res = isRightOrder(left, right);
  assertEquals(res, true);
});

Deno.test("Pair 3", () => {
  const left = [9];
  const right = [[8, 7, 6]];
  const res = isRightOrder(left, right);
  assertEquals(res, false);
});

Deno.test("Pair 4", () => {
  const left = [[4, 4], 4, 4];
  const right = [[4, 4], 4, 4, 4];
  const res = isRightOrder(left, right);
  assertEquals(res, true);
});

Deno.test("Pair 5", () => {
  const left = [7, 7, 7, 7];
  const right = [7, 7, 7];
  const res = isRightOrder(left, right);
  assertEquals(res, false);
});

Deno.test("Pair 6", () => {
  const left: Packet = [];
  const right = [3];
  const res = isRightOrder(left, right);
  assertEquals(res, true);
});

Deno.test("Pair 7", () => {
  const left: Packet = [[[]]];
  const right = [[]];
  const res = isRightOrder(left, right);
  assertEquals(res, false);
});

Deno.test("Pair 8", () => {
  const left = [1, [2, [3, [4, [5, 6, 7]]]], 8, 9];
  const right = [1, [2, [3, [4, [5, 6, 0]]]], 8, 9];
  const res = isRightOrder(left, right);
  assertEquals(res, false);
});
*/

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
  log("B RESULT", solve_b(await parse({ filepath: FILE_PATH })));
  assertEquals(res, GOLD_B);
});
*/
