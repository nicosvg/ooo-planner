export type Pair = [number, number];

export const getPairs = (teamSize: number, weekNumber: number): [number, number][] => {
	const planning = getPlanning([...Array(teamSize).keys()]);
	const offset = weekNumber % planning.length;
	return planning[offset] || [];
};

export function getPlanning(team: number[]): [number, number][][] {
	const planning: [number, number][][] = [];
	const numberOfDays = team.length - 1;
	for (let i = 0; i < numberOfDays; i++) {
		const pairs: [number, number][] = [];
		for (let j = 0; j < team.length; j++) {
			pairs.push([j, (team.length + j + i + 1) % team.length]);
		}
		planning.push(pairs);
	}
	return planning;
}

/**
 * Returns all the possible pairs for the team
 */
export function getAllPairs(team: number[]): Pair[] {
	const res = team.flatMap((v, i) => team.slice(i + 1).map((w) => [v, w]));
	console.log('team', res);
	return res as Pair[];
}
