<script lang="ts">
    import Gallery from "$lib/galleries/Gallery.svelte";

    const {data} = $props();

    const groups: Record<string, string> = {
        "comp_cur": "📂 ⤷ my current videos",
        "comp_aip_old": "📂 ⤷ my old edutainment videos",
        "comp_mc_old": "📂 ⤷ my old Minecraft edits"
    }
</script>

<Gallery {groups} title={'Video editing'} {data} mode={'yt-embed'}/>