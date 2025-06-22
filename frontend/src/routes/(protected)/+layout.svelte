<script lang="ts">
  import '../../app.css';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { logout } from '$lib/authStore.js';
  
	let { data, children } = $props();
  
	function onLogout() {
    logout();
		goto('/');
	}  
</script>

<nav class="mx-auto w-full max-w-screen-lg">
	<div
		class="m-4 flex h-14 items-center justify-between rounded bg-zinc-500/10 px-6 font-medium shadow-md"
	>
		<div>{data.user.username}</div>

		<div class="space-x-4">
			<a
				class={`border-b-2 ${page.url.pathname === '/cars' ? 'border-zinc-500' : 'border-transparent hover:border-zinc-500'}`}
				href="/cars"
			>
				Home
			</a>
			<a
				class={`border-b-2 ${page.url.pathname === '/cars/add' ? 'border-zinc-500' : 'border-transparent hover:border-zinc-500'}`}
				href="/cars/add"
			>
				Add
			</a>
			<button
				class="cursor-pointer rounded bg-red-400 px-4 py-2 text-white hover:bg-red-500/90"
				type="button"
				onclick={onLogout}
			>
				Logout
			</button>
		</div>
	</div>
</nav>

<main class="mx-auto w-full max-w-screen-lg px-4">
	{@render children()}
</main>
