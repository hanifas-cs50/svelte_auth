import { env } from '$env/dynamic/public';
import { browser } from '$app/environment';
import { writable } from 'svelte/store';

type User = {
	id: number;
	username: string;
};

const backendUrl = `${env.PUBLIC_BACKEND_URL}-5004.app.github.dev/user`;
// const backendUrl = `${env.PUBLIC_BACKEND_URL}:5004/user`;

export const loggedUser = writable<User | null>(null);

export async function checkSession() {
	if (!browser) return;

	try {
		const res = await fetch(`${backendUrl}/me`, {
			credentials: 'include'
		});

		if (!res.ok) {
			loggedUser.set(null);
			return;
		}

		const user = await res.json();
		loggedUser.set(user);
	} catch (err) {
		console.error('Failed to check session', err);
		loggedUser.set(null);
	}
}

export async function logout() {
	try {
		await fetch(`${backendUrl}/logout`, {
			method: 'POST',
			credentials: 'include'
		});
		loggedUser.set(null);
	} catch (err) {
		console.error('Logout failed:', err);
	}
}
export async function login(email: String, password: String) {
	try {
		const res = await fetch(`${backendUrl}/login`, {
			method: 'POST',
			credentials: 'include',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password })
		});

		if (!res.ok) throw new Error('Invalid credentials');

		await checkSession();
	} catch (err) {
		console.error('Error logging in: ', err);
		throw new Error(`Error logging in: ${(err as Error).message}`);
	}
}

export async function register(email: String, username: String, password: String) {
	try {
		await fetch(`${backendUrl}/register`, {
			method: 'POST',
			credentials: 'include',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, username, password })
		});
	} catch (err) {
		console.error('Error registering: ', err);
		throw new Error(`Error registering: ${(err as Error).message}`);
	}
}
