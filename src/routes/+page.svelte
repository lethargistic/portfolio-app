<script>
    import SegWelcome from "$lib/segments/SegWelcome.svelte";
    import SegAbout from "$lib/segments/SegAbout.svelte";
    import SegLinktree from "$lib/segments/SegLinktree.svelte";

    let { data } = $props();
</script>

<main>
    <SegWelcome/>
    <SegAbout/>
    <SegLinktree socials={data.socials} />
</main>
{#each Array.from({ length: 100 }) as _, i }
    <p>{i}</p>
{/each}