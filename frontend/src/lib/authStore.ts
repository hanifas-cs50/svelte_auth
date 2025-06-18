import { env } from '$env/dynamic/public';
import { browser } from '$app/environment';
import { writable } from 'svelte/store';

type User = {
	id: number;
	username: string;
};

export const loggedUser = writable<User | null>(getStoredUser());

function getStoredUser() {
	if (!browser) return null;
	const userStr = localStorage.getItem('user');
	return userStr ? JSON.parse(userStr) : null;
}

export async function logout() {
  if (browser) {
    localStorage.removeItem('user');
    loggedUser.set(null);
  }
}

export async function login(email: String, password: String) {
  try {
    const result = await fetch(`${env.PUBLIC_BACKEND_URL}:5004/user/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password })
		});
    const user = await result.json();

    // console.log(user);
		localStorage.setItem('user', JSON.stringify(user));
		loggedUser.set(user);
  } catch (err) {
		console.error('Error logging in: ', err);
		throw new Error(`Error logging in: ${(err as Error).message}`);
  }
}

export async function register(email: String, username: String, password: String) {
  try {
    await fetch(`${env.PUBLIC_BACKEND_URL}:5004/user/register`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, username, password })
		});
  } catch (err) {
		console.error('Error registering: ', err);
		throw new Error(`Error registering: ${(err as Error).message}`);
  }
}
