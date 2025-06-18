<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>


<main class="mx-auto w-full max-w-screen-sm px-4">
	{@render children()}
</main>
