type Schedule = Pair[][];
import { expect, test } from 'vitest';
import { getAllPairs, getPlanning, type Pair } from './pairs';

for (let i = 2; i <= 9; i++) {
	test(`test team of ${i}`, () => {
		// Arrange
		const team: number[] = [...Array(i).keys()];
		// Act
		const results: Pair[][] = getPlanning(team);
		// Assert
		printPlanning(results);

		const allPairs = getAllPairs(team);
		assertAllPairsInResult(results, allPairs);

		// Check that there are no pair in double
		assertNoSamePair(results);

		assertNoTwoPeopleAlone(results);

		// Check that there is no result missing pairs
		expect(results.some((dayPairs) => dayPairs.length < team.length / 2 - 1)).toBeFalsy();
	});
}

function assertNoSamePair(schedule: Schedule) {
	const existing: Pair[] = [];
	for (const week of schedule) {
		for (const pair of week) {
			expect(existing.some((p) => p[0] === pair[0] && p[1] === pair[1])).toBeFalsy();
			existing.push(pair);
		}
	}
}

function assertNoTwoPeopleAlone(schedule: Schedule) {
	for (const pairs of schedule) {
		expect(pairs.filter((p) => p[0] == p[1]).length > 1).toBeFalsy();
	}
}

function assertAllPairsInResult(results: Pair[][], allPairs: Pair[]) {
	const check = allPairs.every((p) => results.flat().some((q) => q[1] === p[1] && q[0] === p[0]));
	expect(check).toBeTruthy();
}

function printPlanning(planning: [number, number][][]) {
	console.log('***** planning:');
	planning.forEach((day, index) => console.log('day', index, day));
}
