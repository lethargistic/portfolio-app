<script>
    import SegWelcome from "$lib/segments/SegWelcome.svelte";
    import SegAbout from "$lib/segments/SegAbout.svelte";
    import SegLinktree from "$lib/segments/SegLinktree.svelte";
</script>

<main>
    <SegWelcome/>
    <SegAbout/>
    <SegLinktree/>
</main>
{#each Array.from({ length: 100 }) as _, i }
    <p>{i}</p>
{/each}