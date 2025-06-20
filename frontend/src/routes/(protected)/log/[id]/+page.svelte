<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { getLog, getSourceType, type Log } from '$lib/logStore';

	let log = $state<Log | undefined>(undefined);
	let error = $state('');

	const rawId = parseInt(page.params.id, 10);
	const id = !isNaN(rawId) ? rawId : undefined;

	const fetchLog = async () => {
		if (id === undefined) {
			error = 'Invalid car ID!';
			return;
		}

		error = '';

		try {
			const raw = await getLog(id);
			log = raw
				? {
						...raw,
		        user: JSON.parse(raw.user),
            source: JSON.parse(raw.source),
						data: JSON.parse(raw.data),
						timestamp: new Date(raw.timestamp).toLocaleString('id-ID', {
							dateStyle: 'medium',
							timeStyle: 'short'
						})
					}
				: undefined;
		} catch (err) {
			error = (err as Error).message;
		}
	};
	onMount(fetchLog);
</script>

<h1 class="mb-4 text-center text-2xl font-bold">Log Details</h1>

{#if error}
	<div class="mb-4 rounded bg-red-200 p-2 text-red-800">{error}</div>
{/if}

<article class="grid w-full rounded p-4 shadow-md">
	<div class="grid gap-1">
		<h4 class="font-medium">Car ID:</h4>
		<p class="rounded bg-zinc-200/60 px-2 py-1 font-medium text-zinc-800 hover:bg-zinc-200">
			{log ? log.data.id : ''}
		</p>
	</div>
	<div class="mt-3 grid gap-1">
		<label class="font-medium" for="user">User: </label>
		<p class="rounded bg-zinc-200/60 px-2 py-1 font-medium text-zinc-800 hover:bg-zinc-200">
			<span class="block">Username: {log ? log.user.username : ''}</span>
			<span class="block">Email: {log ? log.user.email : ''}</span>
		</p>
	</div>
	<div class="mt-3 grid gap-1">
		<label class="font-medium" for="brand">Source: </label>
		<p class="rounded bg-zinc-200/60 px-2 py-1 font-medium text-zinc-800 hover:bg-zinc-200">
			<span class="block">User Agent: {log ? getSourceType(log.source.userAgent) : ''}</span>
			<span class="block">IP: {log ? log.source.ip : ''}</span>
		</p>
	</div>
	<div class="mt-3 grid gap-1">
		<label class="font-medium" for="price">Action: </label>
		<p class="rounded bg-zinc-200/60 px-2 py-1 font-medium text-zinc-800 hover:bg-zinc-200">
			{log ? log.action : ''}
		</p>
	</div>
	<div class="mt-3 grid gap-1">
		<label class="font-medium" for="price">Timestamp: </label>
		<p class="rounded bg-zinc-200/60 px-2 py-1 font-medium text-zinc-800 hover:bg-zinc-200">
			{log ? log.timestamp : ''}
		</p>
	</div>
	{#if log && log.action !== 'DELETE'}
		<div class="mt-3 grid gap-1">
			<label class="font-medium" for="price">Data: </label>
			<p class="rounded bg-zinc-200/60 px-2 py-1 font-medium text-zinc-800 hover:bg-zinc-200">
				<span class="block">Brand: {log ? log.data.brand : ''}</span>
				<span class="block">Model: {log ? log.data.model : ''}</span>
				<span class="block">Price: {log ? log.data.price : ''}</span>
			</p>
		</div>
	{/if}
	<a
		href="/"
		class="mt-4 rounded bg-zinc-500/90 py-2 text-center font-medium text-white hover:bg-zinc-500"
	>
		Back
	</a>
</article>
