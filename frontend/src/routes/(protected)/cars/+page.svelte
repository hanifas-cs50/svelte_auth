<script lang="ts">
	import CarsTable from '$lib/components/carsTable.svelte';
	import LogsTable from '$lib/components/logsTable.svelte';

  let { data } = $props();
</script>

<h1 class="mb-4 text-center text-2xl font-bold">Home</h1>

<CarsTable {data} />

<LogsTable />
