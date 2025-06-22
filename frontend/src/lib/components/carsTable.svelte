<script lang="ts">
	import { onMount } from 'svelte';
	import { initializeLogs } from '$lib/logStore';
	import { initializeCars, cars, deleteCar } from '$lib/carStore';

	let fetchError = $state('');
	let fetchLoading = $state(true);

	let deleteError = $state('');
	let deletingId: string | null = $state(null);

	const fetchCars = async () => {
		fetchError = '';
		fetchLoading = true;
		try {
			await initializeCars();
		} catch (err) {
			fetchError = (err as Error).message;
		} finally {
			fetchLoading = false;
		}
	};

	const onDelete = async (uuid: string) => {
		deleteError = '';
		deletingId = uuid;
		try {
			await deleteCar(uuid);
      await initializeLogs();
		} catch (err) {
			deleteError = (err as Error).message;
		} finally {
			deletingId = null;
		}
	};

	onMount(fetchCars);
</script>

<h3 class="mb-4 text-xl font-bold">Cars Table</h3>

{#if fetchLoading}
	<p class="mb-4 rounded bg-zinc-200 p-2 text-zinc-800">Loading cars...</p>
{:else if !!fetchError}
	<div class="mb-4 rounded bg-red-200 p-2 text-red-800">{fetchError}</div>
	<button
		class="mb-4 w-full cursor-pointer font-medium text-blue-500/80 underline hover:text-blue-500"
		type="button"
		onclick={fetchCars}
	>
		Reload
	</button>
{:else}
	{#if deleteError}
		<div class="mb-4 rounded bg-red-200 p-2 text-red-800">{deleteError}</div>
	{/if}
  
	<table class="mb-4 w-full border-collapse">
		<thead>
			<tr>
				<th class="w-14 border p-2">No.</th>
        <th class="w-20 border p-2">Car ID</th>
				<th class="w-36 border p-2">Model</th>
				<th class="w-36 border p-2">Brand</th>
				<th class="border p-2">Price</th>
				<th class="border p-2" colspan="2">Action</th>
			</tr>
		</thead>
		<tbody class="text-center">
			{#each $cars as { uuid, model, brand, price }, i (uuid)}
				<tr>
					<td class="border p-2">{i + 1}.</td>
					<td class="border p-2">{uuid}</td>
					<td class="border p-2">{model}</td>
					<td class="border p-2">{brand}</td>
					<td class="border p-2">{price}</td>
					<td class="w-20 border">
						<a
							class="flex px-4 py-2 font-medium text-white
								{deletingId === uuid ? 'bg-zinc-500' : 'bg-blue-500/90 hover:bg-blue-500'}"
							href={deletingId === uuid ? '#' : `/cars/update/${uuid}`}
						>
							Update
						</a>
					</td>
					<td class="w-20 border">
						<button
							class="cursor-pointer bg-red-500/90 px-4 py-2 font-medium text-white hover:bg-red-500 disabled:bg-zinc-500"
							type="button"
							onclick={() => onDelete(uuid)}
							disabled={deletingId === uuid}
						>
							Delete
						</button>
					</td>
				</tr>
			{:else}
				<tr>
					<td class="border p-2" colspan="6">No data (yet...)</td>
				</tr>
			{/each}
		</tbody>
	</table>
{/if}