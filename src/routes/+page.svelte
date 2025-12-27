<script>
    import Welcome1 from "$lib/segments/Welcome1.svelte";
    import About2 from "$lib/segments/About2.svelte";
    import Skills3 from "$lib/segments/Skills3.svelte";
</script>

<main>
    <Welcome1/>
    <About2/>
    <Skills3/>
</main>
{#each Array.from({ length: 100 }) as _, i }
    <p>{i}</p>
{/each}