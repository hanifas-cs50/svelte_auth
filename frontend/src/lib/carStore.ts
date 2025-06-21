import { env } from '$env/dynamic/public';
import { writable } from 'svelte/store';

export type Car = {
	uuid: string;
	brand: string;
	model: string;
	price: number;
};

// const MS1_URL = `${env.PUBLIC_BACKEND_URL}-5001.app.github.dev/ms1`;
const MS1_URL = `${env.PUBLIC_BACKEND_URL}:5001/ms1`;

// const MS1_URL = `${env.PUBLIC_BACKEND_URL}-5002.app.github.dev/ms2`;
const MS2_URL = `${env.PUBLIC_BACKEND_URL}:5002/ms2`;

export const cars = writable<Car[]>([]);

async function apiFetch(url: string, options?: RequestInit) {
	const res = await fetch(url, options);
	if (!res.ok) {
		const errorText = await res.text();
		console.error(`Server error: ${errorText}`);
		throw new Error(errorText);
	}
	return res.json();
}

export async function initializeCars() {
	try {
		const data = await apiFetch(`${MS1_URL}/cars`);
		cars.set(data);
	} catch (err) {
		console.error('Error loading cars:', err);
		throw new Error(`Error loading cars: ${(err as Error).message}`);
	}
}

export async function getCar(uuid: string) {
	try {
		return await apiFetch(`${MS1_URL}/car/${uuid}`);
	} catch (err) {
		console.error('Error loading car: ', err);
		throw new Error(`Error loading car: ${(err as Error).message}`);
	}
}

export async function addCar(model: string, brand: string, price: number) {
	try {
		const newCar = await apiFetch(`${MS2_URL}/cars`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			body: JSON.stringify({ model, brand, price })
		});

		cars.update((list) => [...list, newCar.value]);
	} catch (err) {
		console.error('Error adding car: ', err);
		throw new Error(`Error adding car: ${(err as Error).message}`);
	}
}

export async function editCar(uuid: string, model: string, brand: string, price: number) {
	try {
		const updatedCar = await apiFetch(`${MS2_URL}/cars/${uuid}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			body: JSON.stringify({ model, brand, price })
		});
		cars.update((list) => list.map((car) => (car.uuid === uuid ? updatedCar : car)));
	} catch (err) {
		console.error('Error updating car:', err);
		throw new Error(`Error updating car: ${(err as Error).message}`);
	}
}

export async function deleteCar(uuid: string) {
	try {
		await apiFetch(`${MS2_URL}/cars/${uuid}`, {
			method: 'DELETE',
			credentials: 'include'
		});
		cars.update((list) => list.filter((car) => car.uuid !== uuid));
	} catch (err) {
		console.error('Error deleting car: ', err);
		throw new Error(`Error deleting car: ${(err as Error).message}`);
	}
}
