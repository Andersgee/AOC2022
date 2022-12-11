import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { parse, type Puzzle, log } from "../puzzle.ts";

const FILE_PATH = "./src/11/input.txt";
const GOLD_A = 10605;
const GOLD_B = 1;

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
  index: number;
  items: number[];
  inspections: number;
  op: (old: number) => number;
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
      index,
      inspections: 0,
      items,
      op: (old: number) => eval(opstr),
      throw_to: (k: number) => (k % t === 0 ? t_true : t_false),
    };
  });
  return monkeys;
}

function solve_a(puzzle: Puzzle) {
  const monkeys = parseMonkeys(puzzle);

  for (let round = 0; round < 20; round++) {
    for (const monkey of monkeys) {
      while (monkey.items.length > 0) {
        const item = monkey.items.shift();
        if (item) {
          monkey.inspections += 1;
          let worry_level = monkey.op(item);
          worry_level = Math.floor(worry_level / 3); //gets bored
          const throw_to = monkey.throw_to(worry_level);
          log(
            `monkey ${monkey.index} throws item (${worry_level}) to ${throw_to}`
          );
          //log({ worry_level, throw_to });
          monkeys[throw_to].items.push(worry_level);
        }
      }
    }
  }

  log({ monkeys });

  const inspections = monkeys
    .map((monkey) => monkey.inspections)
    .sort((a, b) => b - a);
  log({ inspections });

  const res = inspections[0] * inspections[1];
  return res;
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

  //3760 too low
});
/*
Deno.test("B", async () => {
  const testpuzzle = await parse({ input: TEST_INPUT });
  const res = solve_b(testpuzzle);
  log("B RESULT", solve_b(await parse({ filepath: FILE_PATH })));
  assertEquals(res, GOLD_B);
});
*/
