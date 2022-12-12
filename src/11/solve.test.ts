import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { parse, type Puzzle, log } from "../puzzle.ts";

const FILE_PATH = "./src/11/input.txt";
const GOLD_A = 10605;
const GOLD_B = 2713310158;

const TEST_INPUT = `Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3

Monkey 1:
  Starting items: 54, 65, 75, 74
  Operation: new = old + 6
  Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 0

Monkey 2:
  Starting items: 79, 60, 97
  Operation: new = old * old
  Test: divisible by 13
    If true: throw to monkey 1
    If false: throw to monkey 3

Monkey 3:
  Starting items: 74
  Operation: new = old + 3
  Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 1
`;

type Monkey = {
  t: number;
  index: number;
  items: number[];
  inspections: number;
  increase_worry: (old: number) => number;
  throw_to: (k: number) => number;
};

function parseMonkeys(puzzle: Puzzle) {
  const monkeys: Monkey[] = puzzle.blocks.map((block, index) => {
    const items = block[1].slice(2).map(parseFloat); // [79, 98]
    const opstr = block[2].slice(3).join(" "); // "old * 19"
    const t = parseFloat(block[3][3]); // 23
    const t_true = parseFloat(block[4][5]); // 2
    const t_false = parseFloat(block[5][5]); // 3

    //log({ items, opstr, t, t_true, t_false });

    return {
      t,
      index,
      inspections: 0,
      items,
      increase_worry: (old: number) => eval(opstr),
      throw_to: (k: number) => (k % t === 0 ? t_true : t_false),
    };
  });
  return monkeys;
}

function solve(puzzle: Puzzle, isPartA: boolean) {
  const monkeys = parseMonkeys(puzzle);
  const SHARED_MOD = monkeys.map((monkey) => monkey.t).reduce((a, b) => a * b);

  const ROUNDS = isPartA ? 20 : 10000;
  for (let round = 1; round <= ROUNDS; round++) {
    for (const monkey of monkeys) {
      while (monkey.items.length > 0) {
        const item = monkey.items.shift();
        if (item) {
          monkey.inspections += 1;
          let worry_level = monkey.increase_worry(item);
          if (isPartA) {
            worry_level = Math.floor(worry_level / 3);
          }
          const throw_to = monkey.throw_to(worry_level);
          const recievingMonkey = monkeys[throw_to];
          if (isPartA) {
            recievingMonkey.items.push(worry_level);
          } else {
            recievingMonkey.items.push(worry_level % SHARED_MOD);
          }
        }
      }
    }
    /*
    if (round % 1000 === 0 || [1, 20].some((x) => x === round)) {
      const inspections = monkeys.map((monkey) => monkey.inspections);
      log({ round, inspections });
    }
    */
  }
  /*
  log({ monkeys });
  const inspections = monkeys.map((monkey) => monkey.inspections);
  log({ inspections });
*/
  const sortedInspections = monkeys
    .map((monkey) => monkey.inspections)
    .sort((a, b) => b - a);

  const res = sortedInspections[0] * sortedInspections[1];
  return res;
}

Deno.test("A", async () => {
  const testpuzzle = await parse({ input: TEST_INPUT });
  const res = solve(testpuzzle, true);
  assertEquals(res, GOLD_A);
  log("A RESULT", solve(await parse({ filepath: FILE_PATH }), true));
});

Deno.test("B", async () => {
  const testpuzzle = await parse({ input: TEST_INPUT });
  const res = solve(testpuzzle, false);
  assertEquals(res, GOLD_B);
  log("B RESULT", solve(await parse({ filepath: FILE_PATH }), false));
});
