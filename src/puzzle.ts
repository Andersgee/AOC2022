export type Puzzle = {
  input: string;
  entries: string[];
  blocks: string[][][];
};

type Args = {
  filepath?: string;
  input?: string;
};

export async function parse({ filepath = "./input.txt", input = "" }: Args) {
  const puzzle: Puzzle = {
    input: "",
    entries: [],
    blocks: [],
  };
  if (input) {
    puzzle.input = input;
  } else {
    try {
      puzzle.input = await Deno.readTextFile(filepath);
    } catch (error) {
      throw "Bad filepath?";
    }
  }

  puzzle.entries = puzzle.input.split("\n");
  if (puzzle.entries[puzzle.entries.length - 1] == "") puzzle.entries.pop();

  puzzle.entries.forEach((entry, index) => {
    if (entry.length == 0 || index == 0) puzzle.blocks.push([]);
    if (entry.length == 0) return false;
    const separator = [" | ", " -> ", " ", ","].filter(
      (s) => entry.split(s).length > 1
    );
    const columns: string[] = [];
    if (separator.length > 0) {
      entry
        .split(separator[0])
        .filter((column) => column != "")
        .forEach((column) => columns.push(column));
    } else {
      columns.push(entry);
    }
    puzzle.blocks[puzzle.blocks.length - 1].push(columns);
  });
  return puzzle;
}

export const log = console.log;
