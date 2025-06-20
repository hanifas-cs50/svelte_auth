import { env } from '$env/dynamic/public';
import { writable, type Writable, derived } from 'svelte/store';
import type { Car } from './carStore';

type RawLog = {
	id: number;
  user: string;
	source: string;
	action: string;
	data: string;
	timestamp: string;
};

export type Log = {
	id: number;
  user: { username: string; email: string };
	source: { userAgent: string; ip: string };
	action: string;
	data: Car;
	timestamp: string;
};

// const backendUrl = `${env.PUBLIC_BACKEND_URL}-5003.app.github.dev/ms3`;
const backendUrl = `${env.PUBLIC_BACKEND_URL}:5003/ms3`;

const initLogs = writable<RawLog[]>([]);
export const logs = derived<Writable<RawLog[]>, Log[]>(initLogs, ($initLogs) =>
	$initLogs.map((log) => ({
		...log,
		user: JSON.parse(log.user),
		source: JSON.parse(log.source),
		data: JSON.parse(log.data),
		timestamp: new Date(log.timestamp).toLocaleString('id-ID', {
			dateStyle: 'medium',
			timeStyle: 'short'
		})
	}))
);

export async function initializeLogs() {
	try {
		const res2 = await fetch(`${backendUrl}/logs`);
		if (!res2.ok) throw new Error('Failed to fetch logs');

		const data2 = await res2.json();
		initLogs.set(data2);
	} catch (err) {
		console.error('Error loading logs: ', err);
		throw new Error(`Error loading logs: ${(err as Error).message}`);
	}
}

export async function getLog(id: number) {
	try {
		const res = await fetch(`${backendUrl}/log/${id}`);
		if (!res.ok) throw new Error('Failed to fetch log');

		return await res.json();
	} catch (err) {
		console.error('Error loading log: ', err);
		throw new Error(`Error loading log: ${(err as Error).message}`);
	}
}

export function getSourceType(userAgent: string) {
	if (/postman/i.test(userAgent)) {
		return 'Postman';
	} else if (/curl/i.test(userAgent)) {
		return 'Curl';
	} else if (/mozilla|chrome|safari|firefox/i.test(userAgent)) {
		return 'Frontend';
	} else {
		return 'Unknown';
	}
}
