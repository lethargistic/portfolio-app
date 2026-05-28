<script lang="ts">
    import Gallery from "$lib/galleries/Gallery.svelte";

    const {data} = $props();

    const groups: Record<string, string> = {
        "comp_all": "📂 ⤷ just a list of some of my builds in no particular order",
    }
</script>

<Gallery {groups} title={'Builds'} {data}/>