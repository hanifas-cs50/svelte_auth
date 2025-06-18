<script lang="ts">
	import { goto } from '$app/navigation';
	import { login, register } from '$lib/authStore';

	let error = $state('');
	let loading = $state(false);

	async function onSubmit(e: SubmitEvent) {
		e.preventDefault();
		error = '';
		loading = true;

		const formData = new FormData(e.currentTarget as HTMLFormElement);
		const username = (formData.get('username') as string).trim();
		const password = (formData.get('password') as string).trim();

		if (!username || !password) {
			error = 'All fields are required';
			loading = false;
			return;
		}

		try {
			await register(username, password);
      await login(username, password);
      goto("/");
		} catch (err) {
			error = (err as Error).message;
		} finally {
			loading = false;
		}
	}
</script>

<h1 class="mb-4 mt-14 text-center text-2xl font-bold">Register</h1>

{#if error}
	<div class="mb-4 rounded bg-red-200 p-2 text-red-800">{error}</div>
{/if}

<form class="grid w-full rounded p-4 shadow-md" onsubmit={onSubmit}>
	<div class="grid gap-1">
		<label class="font-medium" for="username">Username: </label>
		<input
			class="rounded border-2 border-zinc-500/60 px-2 py-1 font-medium text-zinc-800 outline-none hover:border-zinc-500 focus:border-zinc-500"
			type="text"
			id="username"
			name="username"
			autocomplete="off"
			required
		/>
	</div>
	<div class="mt-3 grid gap-1">
		<label class="font-medium" for="password">Password: </label>
		<input
			class="rounded border-2 border-zinc-500/60 px-2 py-1 font-medium text-zinc-800 outline-none hover:border-zinc-500 focus:border-zinc-500"
			type="password"
			id="password"
			name="password"
			autocomplete="off"
			required
		/>
	</div>

	<button
		class="mt-4 cursor-pointer rounded bg-blue-500/90 py-2 font-medium text-white hover:bg-blue-500 disabled:bg-zinc-500"
		type="submit"
		disabled={loading}
	>
		{loading ? 'Registering...' : 'Register'}
	</button>
	<a
		class="mt-1 rounded bg-zinc-500/90 py-2 text-center font-medium text-white hover:bg-zinc-500 {loading
			? 'opacity-50'
			: ''}"
		href={loading ? '#' : `/`}
	>
		Back
	</a>
</form>

<p class="mt-4 text-center font-medium">
	Already have an account? <a
		class="text-blue-500/90 transition-colors hover:text-blue-500"
		href="/">login now...</a
	>
</p>
