<script>
    import Welcome1 from "$lib/segments/Welcome1.svelte";
</script>

<Welcome1 />

{#each Array.from({ length: 100 }) as _, i }
    <p>{i}</p>
{/each}