type Schedule = Pair[][];
import { describe, expect, test } from 'vitest';
import { getAllPairs, getPlanning, type Pair } from './pairs';

for (let i = 2; i <= 6; i++) {
	describe(`test team of ${i}`, () => {
		test(`all members in result`, () => {
			// Arrange
			const team: number[] = [...Array(i).keys()];
			// Act
			const results: Pair[][] = getPlanning(team);
			// Assert
			for (const day of results) {
				const flattened = [...new Set(day.flat())];
				console.log('flattened', flattened);
				expect(flattened).toHaveLength(i);
				expect(flattened.sort()).toEqual(team.sort());
			}
		});

		test(`no pair in double`, () => {
			// Arrange
			const team: number[] = [...Array(i).keys()];
			// Act
			const results: Pair[][] = getPlanning(team);
			// Assert
			// Check that there are no pair in double
			assertNoSamePair(results);
		});

		test(`no two members alone`, () => {
			// Arrange
			const team: number[] = [...Array(i).keys()];
			// Act
			const results: Pair[][] = getPlanning(team);
			// Assert
			assertNoTwoPeopleAlone(results);
		});

		test(`correct number of pairs`, () => {
			// Arrange
			const team: number[] = [...Array(i).keys()];
			// Act
			const results: Pair[][] = getPlanning(team);
			// Assert
			// Check that there is no result missing pairs
			expect(results.some((dayPairs) => dayPairs.length < team.length / 2)).toBeFalsy();
		});
		// TODO : test that no member is in two pairs
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

/**
 * Check that all pairs are mutual: if Alice is paired with Bob, Bob should be paired with Alice
 */
function assertMutualPairs(schedule: Schedule) {
	for (const week of schedule) {
		for (const pair of week) {
			expect(week.some((p) => p[0] == pair[1] && p[1] == pair[0])).toBeTruthy();
		}
	}
}

function assertNoTwoPeopleAlone(schedule: Schedule) {
	for (const pairs of schedule) {
		expect(pairs.filter((p) => p[0] == p[1]).length > 1).toBeFalsy();
	}
}

function assertAllPairsInResult(results: Pair[][], allPairs: Pair[]) {
	const check = allPairs.every((p) => results.flat().some((q) => pairsEqual(q, p)));
	expect(check).toBeTruthy();
}

function pairsEqual(q: Pair, p: Pair): unknown {
	return (q[1] === p[1] && q[0] === p[0]) || (q[1] === p[0] && q[0] === p[1]);
}

function printPlanning(planning: [number, number][][]) {
	console.log('***** planning ');
	planning.forEach((day, index) => console.log('day', index, day));
}
