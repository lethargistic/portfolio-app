<script lang="ts">
    import {activeEditor, editorSocials, sidebar} from "$lib/shared.svelte";
    import {isEmptyArr} from "$lib/utils/utils";

    let sidebarElem: HTMLElement | null = $state(null);

    const checkIfClose = (e: MouseEvent) => {
        if (!sidebarElem) return;
        if (sidebar.open === false) return;
        if (sidebar.skip) {
            sidebar.skip = false;
            return;
        }

        if (!(sidebarElem.contains(e.target as Node) || sidebarElem.isEqualNode(e.target as HTMLElement))) {
            sidebar.open = false
        }
    }

    const focusedSocialIx = $derived.by(() => {
        if (isEmptyArr(editorSocials.state)) return -1;

        const ix = editorSocials.state.findIndex((social: typeof editorSocials.state[number]) => social.name === sidebar.focused);
        if (ix == null) return -1;
        return ix;
    });

    const readOnlySocial = $derived(editorSocials.state[focusedSocialIx]);
</script>

<svelte:window onclick={checkIfClose}/>
<aside bind:this={sidebarElem} class="sidebar">
    <p>{readOnlySocial.name}</p>
    <form>
        {#if activeEditor.state === 'lnkt-modifying' && !isEmptyArr(editorSocials.state)}
            {#each readOnlySocial.folds as roFold, ig (roFold.slug)}
                {roFold.slug}
                {#each Object.keys(roFold) as key (key)}
                    <label>
                        {key}
                        <input bind:value={editorSocials.state[focusedSocialIx].folds[ig][key]}
                               placeholder={roFold[key]}>
                    </label>
                {/each}
            {/each}
            <button>e
            </button>
        {/if}

    </form>
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

        & form {
            display: flex;
            flex-direction: column;

            & label {
            }
        }
    }
</style>