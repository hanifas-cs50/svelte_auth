<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { editCar, getCar, type Car } from '$lib/carStore';
	import { onMount } from 'svelte';

	let car = $state<Car | undefined>(undefined);
	let error = $state('');
	let loading = $state(false);

	const rawId = parseInt(page.params.id, 10);
	const id = !isNaN(rawId) ? rawId : undefined;

	const fetchCar = async () => {
		if (id === undefined) {
			error = 'Invalid car ID!';
			return;
		}

		error = '';
		loading = true;

		try {
			car = await getCar(id);
		} catch (err) {
			error = (err as Error).message;
		} finally {
			loading = false;
		}
	};

	onMount(fetchCar);

	async function onSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (car === undefined || id === undefined) {
			error = 'Invalid car ID! (Why did you do that?)';
			return;
		}

		error = '';
		loading = true;

		const formData = new FormData(e.currentTarget as HTMLFormElement);
		const model = (formData.get('model') as string).trim();
		const brand = (formData.get('brand') as string).trim();
		const price = Number(formData.get('price'));

		if (!model || !brand || isNaN(price) || price <= 0) {
			error = 'All fields are required';
			loading = false;
			return;
		}

		try {
			await editCar(id, model, brand, price);
			goto('/');
		} catch (err) {
			error = (err as Error).message;
		} finally {
			loading = false;
		}
	}
</script>

<h1 class="mb-4 text-center text-2xl font-bold">Update</h1>

{#if error}
	<div class="mb-4 rounded bg-red-200 p-2 text-red-800">{error}</div>
{/if}

<form class="grid w-full rounded p-4 shadow-md" onsubmit={onSubmit}>
	<div class="grid gap-1">
		<label class="font-medium" for="model">Model: </label>
		<input
			class="rounded border-2 border-zinc-500/60 px-2 py-1 font-medium text-zinc-800 outline-none hover:border-zinc-500 focus:border-zinc-500"
			type="text"
			id="model"
			name="model"
			defaultValue={car ? car.model : ''}
			autocomplete="off"
			required
		/>
	</div>
	<div class="mt-3 grid gap-1">
		<label class="font-medium" for="brand">Brand: </label>
		<input
			class="rounded border-2 border-zinc-500/60 px-2 py-1 font-medium text-zinc-800 outline-none hover:border-zinc-500 focus:border-zinc-500"
			type="text"
			id="brand"
			name="brand"
			defaultValue={car ? car.brand : ''}
			autocomplete="off"
			required
		/>
	</div>
	<div class="mt-3 grid gap-1">
		<label class="font-medium" for="price">Price: </label>
		<input
			class="rounded border-2 border-zinc-500/60 px-2 py-1 font-medium text-zinc-800 outline-none hover:border-zinc-500 focus:border-zinc-500"
			type="number"
			id="price"
			defaultValue={car ? car.price : ''}
			name="price"
			min="1"
			max="99999"
			required
		/>
	</div>

	<button
		type="submit"
		class="mt-4 cursor-pointer rounded bg-blue-500/90 py-2 font-medium text-white hover:bg-blue-500 disabled:bg-zinc-500"
		disabled={car === undefined || loading}
	>
		{loading ? 'Updating...' : 'Update'}
	</button>
	<a
		href={loading ? '#' : `/`}
		class="mt-1 rounded bg-zinc-500/90 py-2 text-center font-medium text-white hover:bg-zinc-500 {loading
			? 'opacity-50'
			: ''}"
	>
		Back
	</a>
</form>