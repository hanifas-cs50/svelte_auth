<script lang="ts">
	import { goto } from '$app/navigation';
	import { login } from '$lib/authStore';

	let error = $state('');
	let loading = $state(false);

	async function onSubmit(e: SubmitEvent) {
		e.preventDefault();
		error = '';
		loading = true;

		const formData = new FormData(e.currentTarget as HTMLFormElement);
		const email = (formData.get('email') as string).trim();
		const password = (formData.get('password') as string).trim();

		if (!email || !password) {
			error = 'All fields are required';
			loading = false;
			return;
		}

		try {
			await login(email, password);
			goto('/cars');
		} catch (err) {
			error = (err as Error).message;
		} finally {
			loading = false;
		}
	}
</script>

<h1 class="mb-4 mt-14 text-center text-2xl font-bold">Login</h1>

{#if error}
	<div class="mb-4 rounded bg-red-200 p-2 text-red-800">{error}</div>
{/if}

<form class="grid w-full rounded p-4 shadow-md" onsubmit={onSubmit}>
	<div class="grid gap-1">
		<label class="font-medium" for="email">Email: </label>
		<input
			class="rounded border-2 border-zinc-500/60 px-2 py-1 font-medium text-zinc-800 outline-none hover:border-zinc-500 focus:border-zinc-500"
			type="email"
			id="email"
			name="email"
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
		{loading ? 'Logging in...' : 'Login'}
	</button>
	<!-- <a
		class="mt-1 rounded bg-zinc-500/90 py-2 text-center font-medium text-white hover:bg-zinc-500 {loading
			? 'opacity-50'
			: ''}"
		href={loading ? '#' : `/`}
	>
		Back
	</a> -->
</form>

<p class="mt-4 text-center font-medium">
	Don't have an account? <a
		class="text-blue-500/90 transition-colors hover:text-blue-500"
		href="/register">register now...</a
	>
</p>
