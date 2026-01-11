<script lang="ts">
    import {activeEditor, sidebar} from "$lib/shared.svelte";

    let sidebarElem: HTMLElement | null = $state(null);

    const checkIfClose = (e: MouseEvent) => {
        if (!sidebarElem) return;
        if (sidebar.open === false) return;
        if (sidebar.skip) {
            sidebar.skip = false;
            console.log("skipped")
            return;
        }

        if (!(sidebarElem.contains(e.target as Node) || sidebarElem.isEqualNode(e.target as HTMLElement))) {
            console.log("ha")
            sidebar.open = false
        }
    }
</script>

<svelte:window onclick={checkIfClose}/>
<aside bind:this={sidebarElem} class="sidebar">
    {#if activeEditor.state === 'lnktPositioning'}
        <!-- -->
    {/if}
</aside>

<style>
    aside {
        position: fixed;
        right: 0;
        top: 0;
        z-index: 10000000;

        width: 20vw;
        height: 100vh;

        background-color: white;

        &:hover {
            cursor: default;
        }
    }
</style>