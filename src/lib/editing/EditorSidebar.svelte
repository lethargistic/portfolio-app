<script lang="ts">
    import {activeEditor, editorSocials, MAX_CHIME_FOLDS, sidebar} from "$lib/shared.svelte";
    import {isEmptyArr, SeparatorShape} from "$lib/utils/utils";

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
    const isNumberInvalid = (key: string, trueKey: string, value: number, upperBound: number) => {
        return key === trueKey && (value > upperBound || isNaN(value))
    }
</script>

<svelte:window onclick={checkIfClose}/>
<aside bind:this={sidebarElem} class="sidebar">
    <h2>{readOnlySocial.name}</h2>
    <form>
        {#if activeEditor.state === 'lnkt-modifying' && !isEmptyArr(editorSocials.state)}
            {#each Object.keys(readOnlySocial).filter((key: String) => key !== 'folds')
                    as key (key + '_salt143')}
                {@const readOnlyVal = editorSocials.state[focusedSocialIx][key]}
                {@const isInvalidFoldCount = isNumberInvalid(key, 'fold_count', readOnlyVal, MAX_CHIME_FOLDS)}
                <label>
                    {key}
                    <input bind:value={() => editorSocials.state[focusedSocialIx][key],
                    (v) => {if (key === 'fold_count' && isNaN(v)) return null;
                        editorSocials.state[focusedSocialIx][key] = v}}
                           placeholder={editorSocials.state[focusedSocialIx][key]}
                           class={`${isInvalidFoldCount ? 'invalid' : ''}`}>
                </label>
                {#if key === 'separator_shape'}
                    <small>Out of: {Object.keys(SeparatorShape)}</small>
                {/if}
            {/each}
            <p><b>Folds:</b></p>
            {#each readOnlySocial.folds as roFold, ig (roFold.slug)}
                {roFold.slug}
                {#each Object.keys(roFold) as key (key + '_salt173')}
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
    .invalid {
        background-color: #ffa9a9;
    }

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

            gap: 0.2rem;

            & label {
            }
        }
    }
</style>