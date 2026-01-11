<script lang="ts">
    import {editorMode, sidebar} from "$lib/shared.svelte";
import EditorSidebar from "$lib/editing/EditorSidebar.svelte";
</script>

{#if editorMode.state}
    {#if sidebar.open}
        <EditorSidebar/>
    {/if}
{/if}