import { KV_REST_API_TOKEN, KV_REST_API_URL } from '$env/static/private';
import { json, type RequestHandler } from '@sveltejs/kit';
import { Redis } from '@upstash/redis';
import { v4 as uuidv4 } from 'uuid';

const kv = new Redis({
	url: KV_REST_API_URL,
	token: KV_REST_API_TOKEN
});
export const POST: RequestHandler = async (request) => {
	const body = await request.request.json();
	if (!body.team) {
		return new Response('Missing team', { status: 400 });
	}
	console.log(body);
	const id: string = body.id || uuidv4();
	kv.set(id, body.team);
	return json({ id }, { status: 200 });
};
