<script lang="ts">
	import '../app.css';
	let { data, children } = $props();
</script>

<main class="mx-auto w-full max-w-screen-lg px-4">
	{data.user}
	{@render children()}
</main>
