<script lang="ts">
    import {editorMode, editbar} from "$lib/shared.svelte";
    import EditorSidebar from "$lib/editing/EditorSidebar.svelte";

    let { form } = $props();
 </script>

{#if editorMode.state}
    {#if editbar.open}
        <EditorSidebar {form}/>
    {/if}
{/if}