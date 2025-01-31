import { KV_REST_API_TOKEN, KV_REST_API_URL } from '$env/static/private';
import { Redis } from '@upstash/redis';
import type { Actions } from './$types';

const kv = new Redis({
	url: KV_REST_API_URL,
	token: KV_REST_API_TOKEN
});

/** @type {import('./$types').PageLoad} */
export async function load({ url }) {
	if (!url.searchParams) return { team: [] };
	const teamId = url.searchParams.get('id');
	if (!teamId) return { team: [] };
	const team = await kv.get(teamId);
	console.log('the team is', team);
	return { team: team || [] };
}

export const actions = {
	saveTeam: async ({ request }) => {
		const data = await request.formData();
		const email = data.get('team');
		// __AUTO_GENERATED_PRINT_VAR_START__
		console.log('(anon) email: %s', email); // __AUTO_GENERATED_PRINT_VAR_END__
		await kv.set('test', ['Nico, Math']);
	}
} satisfies Actions;
