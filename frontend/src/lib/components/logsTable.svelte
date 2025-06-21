<script lang="ts">
	import { getSourceType, initializeLogs, logs } from '$lib/logStore';
	import { onMount } from 'svelte';

	let fetchError = $state('');
	let fetchLoading = $state(true);

	const fetchLogs = async () => {
		fetchError = '';
		fetchLoading = true;
		try {
			await initializeLogs();
		} catch (err) {
			fetchError = (err as Error).message;
		} finally {
			fetchLoading = false;
		}
	};

	onMount(fetchLogs);
</script>

<h3 class="mb-4 text-xl font-bold">Logs Table</h3>

{#if fetchLoading}
	<p class="mb-4 rounded bg-zinc-200 p-2 text-zinc-800">Loading logs...</p>
{:else if !!fetchError}
	<div class="mb-4 rounded bg-red-200 p-2 text-red-800">{fetchError}</div>
	<button
		class="w-full cursor-pointer font-medium text-blue-500/80 underline hover:text-blue-500"
		type="button"
		onclick={() => fetchLogs()}
	>
		Reload
	</button>
{:else}
	<table class="mb-4 w-full border-collapse">
		<thead>
			<tr>
				<th class="w-14 border p-2">No.</th>
				<th class="w-20 border p-2">Car ID</th>
				<th class="w-36 border p-2">Username</th>
				<th class="w-36 border p-2">Source</th>
				<th class="border p-2">Action</th>
				<th class="border p-2">Timestamp</th>
				<th class="border p-2">Details</th>
			</tr>
		</thead>
		<tbody class="text-center">
			{#each $logs as { id, user, source, action, data, timestamp }, i (id)}
				<tr>
					<td class="border p-2">{i + 1}.</td>
					<td class="border p-2">{data.uuid}</td>
					<td class="border p-2">{user.username}</td>
					<td class="border p-2">{getSourceType(source.userAgent)}</td>
					<td class="border p-2">{action}</td>
					<td class="border p-2">{timestamp}</td>
					<td class="w-20 border">
						<a
							class="flex px-4 py-2 font-medium text-white bg-blue-500/90 hover:bg-blue-500"
							href="/log/{id}"
						>
							Details
						</a>
					</td>
				</tr>
			{:else}
				<tr>
					<td class="border p-2" colspan="7">No data (yet...)</td>
				</tr>
			{/each}
		</tbody>
	</table>
{/if}