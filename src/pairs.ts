export type Pair = [number, number];

export const getPairs = (teamSize: number, weekNumber: number): [number, number][] => {
	const planning = getPlanning([...Array(teamSize).keys()]);
	const offset = weekNumber % planning.length;
	return planning[offset] || [];
};

export function getPlanning(theTeam: number[]): [number, number][][] {
	const planning: [number, number][][] = [];
	const team = [...theTeam];
	if (team.length % 2 !== 0) {
		team.push(-1); // Add a dummy player if odd number of team members
	}

	const max = team.length - 1;
	const n = team.length - 2;

	for (let day = 0; day < max; day++) {
		const dailyPairs: [number, number][] = [];
		// First member is fixed
		const meetsFirst = day === 0 ? n : (n + day) % max;
		dailyPairs.push([team[max], team[meetsFirst]]);
		for (let i = 0; i < n / 2; i++) {
			const j = (n - 1 + day - i) % max;
			dailyPairs.push([team[(i + day) % max], team[j]]);
		}
		planning.push(dailyPairs);
	}

	// Remove any pairs with the dummy player
	return planning.map((day) =>
		day.map((pair) => {
			if (pair[0] === -1) return [pair[1], pair[1]];
			if (pair[1] === -1) return [pair[0], pair[0]];
			return pair;
		})
	);
}

/**
 * Returns all the possible pairs for the team
 */
export function getAllPairs(team: number[]): Pair[] {
	const res = team.flatMap((v, i) => team.slice(i + 1).map((w) => [v, w]));
	// console.log('team', res);
	return res as Pair[];
}
