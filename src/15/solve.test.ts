import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { log, parse, type Puzzle } from "../puzzle.ts";

const FILE_PATH = "./src/15/input.txt";
const GOLD_A = 26;
const GOLD_B = 56000011;
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

function xvalsAtY(sensor: Sensor, y: number) {
	const dy = Math.abs(y - sensor.pos[1]);
	const dx = Math.abs(sensor.distToBeacon - dy);
	if ((dy + dx) > sensor.distToBeacon) {
		return [undefined, undefined];
	}
	const left = sensor.pos[0] - dx;
	const right = sensor.pos[0] + dx;
	return [left, right];
}

function freqcalc(x: number, y: number) {
	return x * 4000000 + y;
}

function solve_b(puzzle: Puzzle, maxX: number, maxY: number) {
	const sensors = parseSensorsBeacons(puzzle);

	for (let y = 0; y <= maxY; y++) {
		const segments: Array<{ index: number; from: number; to: number }> = [];
		let index = 0;
		for (const sensor of sensors) {
			const [left, right] = xvalsAtY(sensor, y);
			if (left !== undefined && right !== undefined) {
				segments.push({ index, from: left, to: right });
				index += 1;
			}
		}

		const sortedSegments = segments.sort((a, b) => a.from - b.from);

		const consumedInds = new Set<number>();
		const limits = sortedSegments[0]; //initial
		consumedInds.add(sortedSegments[0].index);

		for (let i = 0; i < sortedSegments.length; i++) { //repeat this couple of times
			for (const segment of sortedSegments) {
				if (!consumedInds.has(segment.index) && segment.from <= limits.to) {
					limits.to = Math.max(limits.to, segment.to);
					consumedInds.add(segment.index);
				}
			}
		}
		if (limits.from > 0) {
			const x = limits.from;
			log(`found uncovered (limits.from) coord: ${x}-${y}`);
			return freqcalc(x, y);
		}

		if (limits.to < maxX) {
			const x = limits.to + 1;
			log(`found uncovered (limits.to) coord : ${x}-${y}`);
			return freqcalc(x, y);
		}

		//log(y);
	}

	return 0;
}

Deno.test("B", async () => {
	const testpuzzle = await parse({ input: TEST_INPUT });
	const res = solve_b(testpuzzle, 20, 20);

	log(
		"B RESULT",
		solve_b(await parse({ filepath: FILE_PATH }), 4000000, 4000000),
	);

	assertEquals(res, GOLD_B);
});
