<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import { loggedUser, logout } from '$lib/authStore';

	let { children } = $props();
</script>

{#if $loggedUser}
	<nav class="mx-auto w-full max-w-screen-lg">
		<div
			class="m-4 flex h-14 items-center justify-between rounded bg-zinc-500/10 px-6 font-medium shadow-md"
		>
			<div>{$loggedUser.username}</div>

			<div class="space-x-4">
				<a
					class={`border-b-2 ${page.url.pathname === '/' ? 'border-zinc-500' : 'border-transparent hover:border-zinc-500'}`}
					href="/"
				>
					Home
				</a>
				<a
					class={`border-b-2 ${page.url.pathname === '/add' ? 'border-zinc-500' : 'border-transparent hover:border-zinc-500'}`}
					href="/add"
				>
					Add
				</a>
				<button
					class="cursor-pointer rounded bg-red-400 px-4 py-2 text-white hover:bg-red-500/90"
					type="button"
					onclick={() => logout()}
				>
					Logout
				</button>
			</div>
		</div>
	</nav>
{/if}

<main class="mx-auto w-full max-w-screen-lg px-4">
	{@render children()}
</main>
