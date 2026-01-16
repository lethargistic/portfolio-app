<script lang="ts">
    import {editbar, settings} from "$lib/shared.svelte";
    import EditorSidebar from "$lib/editing/EditorSidebar.svelte";

    let { form } = $props();
 </script>

{#if settings.editor.state}
    {#if editbar.open}
        <EditorSidebar {form}/>
    {/if}
{/if}