import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { log, parse, type Puzzle } from "../puzzle.ts";

const FILE_PATH = "./src/15/input.txt";
const GOLD_A = 26;
const GOLD_B = 1;
const TEST_INPUT = `Sensor at x=2, y=18: closest beacon is at x=-2, y=15
Sensor at x=9, y=16: closest beacon is at x=10, y=16
Sensor at x=13, y=2: closest beacon is at x=15, y=3
Sensor at x=12, y=14: closest beacon is at x=10, y=16
Sensor at x=10, y=20: closest beacon is at x=10, y=16
Sensor at x=14, y=17: closest beacon is at x=10, y=16
Sensor at x=8, y=7: closest beacon is at x=2, y=10
Sensor at x=2, y=0: closest beacon is at x=2, y=10
Sensor at x=0, y=11: closest beacon is at x=2, y=10
Sensor at x=20, y=14: closest beacon is at x=25, y=17
Sensor at x=17, y=20: closest beacon is at x=21, y=22
Sensor at x=16, y=7: closest beacon is at x=15, y=3
Sensor at x=14, y=3: closest beacon is at x=15, y=3
Sensor at x=20, y=1: closest beacon is at x=15, y=3
`;

type Coord = [x: number, y: number];

type Sensor = {
	pos: Coord;
	closestBeacon: Coord;
	distToBeacon: number;
};

function parseSensorsBeacons(puzzle: Puzzle) {
	const lines = puzzle.input.trim().split("\n");
	const sensors: Sensor[] = lines.map((line) => {
		const items = line.split(" ");
		const sx = parseFloat(items[2].slice(0, -1).split("=")[1]);
		const sy = parseFloat(items[3].slice(0, -1).split("=")[1]);

		const bx = parseFloat(items[8].slice(0, -1).split("=")[1]);
		const by = parseFloat(items[9].split("=")[1]);

		//const distToBeacon = Math.abs(bx - sx) + Math.abs(by - sy);
		const distToBeacon = manhattanDist([bx, by], [sx, sy]);
		return {
			pos: [sx, sy],
			closestBeacon: [bx, by],
			distToBeacon,
		};
	});

	//log({ sensors });
	return sensors;
}

function manhattanDist(from: Coord, to: Coord) {
	return Math.abs(to[0] - from[0]) + Math.abs(to[1] - from[1]);
}

function coveredCoords(sensor: Sensor) {
	const topleft = [
		sensor.pos[0] - sensor.distToBeacon,
		sensor.pos[1] - sensor.distToBeacon,
	];
	const botright = [
		sensor.pos[0] + sensor.distToBeacon,
		sensor.pos[1] + sensor.distToBeacon,
	];
	const coords: Coord[] = [];
	log(`calculating coords with distToBeacon:${sensor.distToBeacon}`);
	for (let y = topleft[1]; y < botright[1]; y++) {
		for (let x = topleft[0]; x < botright[0]; x++) {
			if (manhattanDist(sensor.pos, [x, y]) <= sensor.distToBeacon) {
				coords.push([x, y]);
			}
		}
	}
	return coords;
}

function coveredCoordsOnRow(sensor: Sensor, y: number) {
	const topleft = [
		sensor.pos[0] - sensor.distToBeacon,
		sensor.pos[1] - sensor.distToBeacon,
	];
	const botright = [
		sensor.pos[0] + sensor.distToBeacon,
		sensor.pos[1] + sensor.distToBeacon,
	];
	const coords: Coord[] = [];
	log(`calculating coords with distToBeacon:${sensor.distToBeacon}`);
	for (let x = topleft[0]; x < botright[0]; x++) {
		if (manhattanDist(sensor.pos, [x, y]) <= sensor.distToBeacon) {
			coords.push([x, y]);
		}
	}
	return coords;
}

function solve_a(puzzle: Puzzle, examinedRow: number) {
	const sensors = parseSensorsBeacons(puzzle);
	log({ sensors });

	//const covered = new Set<string>();
	const covering_examinedRow = new Set<string>();
	for (const sensor of sensors) {
		log(`processing sensor at ${sensor.pos[0]}-${sensor.pos[1]}`);
		const coords = coveredCoordsOnRow(sensor, examinedRow);
		log("now have coords");
		for (const coord of coords) {
			const str = `${coord[0]}-${coord[1]}`;
			//covered.add(str);
			if (coord[1] === examinedRow) {
				covering_examinedRow.add(str);
			}
		}
	}

	//remove any already occupied...
	for (const sensor of sensors) {
		const str1 = `${sensor.pos[0]}-${sensor.pos[1]}`;
		covering_examinedRow.delete(str1);

		const str2 = `${sensor.closestBeacon[0]}-${sensor.closestBeacon[1]}`;
		covering_examinedRow.delete(str2);
	}
	//log({ covering_examinedRow, sz: covering_examinedRow.size });

	/*
	let minX = Infinity;
	let maxX = -Infinity;
	let minY = Infinity;
	let maxY = -Infinity;
	for (const sensor of sensors) {
		minX = Math.min(minX, sensor.pos[0] - sensor.distToBeacon);
		maxX = Math.max(maxX, sensor.pos[0] + sensor.distToBeacon);

		minY = Math.min(minY, sensor.pos[1] - sensor.distToBeacon);
		maxY = Math.max(maxY, sensor.pos[1] + sensor.distToBeacon);
	}

	let nCovered = 0;
	for (let x = minX; x < maxX; x++) {
		const str = `${x}-${examinedRow}`;
		if (covered.has(str)) {
			nCovered += 1;
		}
	}
	//log({ covered, nCovered });

	return nCovered;
  */

	return covering_examinedRow.size;
}

/*
function solve_b(puzzle: Puzzle) {
  const res = 0;
  return res;
}
 */
Deno.test("A", async () => {
	const testpuzzle = await parse({ input: TEST_INPUT });
	const res = solve_a(testpuzzle, 10);
	assertEquals(res, GOLD_A);
	log("A RESULT", solve_a(await parse({ filepath: FILE_PATH }), 2000000));
});

/*
Deno.test("B", async () => {
  const testpuzzle = await parse({ input: TEST_INPUT });
  const res = solve_b(testpuzzle);
  assertEquals(res, GOLD_B);
  //log("B RESULT", solve_b(await parse({ filepath: FILE_PATH })));
});
*/
