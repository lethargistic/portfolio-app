<script lang="ts">
    import {activeEditor, editorSocials, MAX_CHIME_FOLDS, editbar} from "$lib/shared.svelte";
    import {convertSimpleDataTypesImplicitly, isEmptyArr, SeparatorShape} from "$lib/utils/utils";
    import {applyAction, enhance} from "$app/forms";
    import type {SubmitFunction} from "@sveltejs/kit";
    import {untrack} from "svelte";

    let sidebarElem: HTMLElement | null = $state(null);

    let {form} = $props();

    const checkIfClose = (e: MouseEvent) => {
        if (!sidebarElem) return;
        if (editbar.open === false) return;
        if (editbar.skip) {
            editbar.skip = false;
            return;
        }

        if (!(sidebarElem.contains(e.target as Node) || sidebarElem.isEqualNode(e.target as HTMLElement))) {
            editbar.open = false
        }
    }

    const readOnlySocial = $derived(editorSocials.state[editbar.focusedIx]);
    const isNumberInvalid = (key: string, trueKey: string, value: number, upperBound: number) => {
        return key === trueKey && (value > upperBound || isNaN(value))
    }

    let awaitingConfirmation = $state(false);
    let loading = $state(false);
    let postText = $derived(loading ? 'Loading...' : awaitingConfirmation ? 'You sure?' : 'Post');
    let deleteText = $derived(loading ? 'Loading...' : awaitingConfirmation ? 'You sure?' : 'Delete (oh no)');

    const handleSubmit: SubmitFunction = ({formData, cancel}) => {
        if (!awaitingConfirmation) {
            awaitingConfirmation = !awaitingConfirmation;
            return cancel();
        }
        loading = true

        const realSocialData = editorSocials.state[editbar.focusedIx];
        formData.delete('*');

        for (const [key, value] of Object.entries(realSocialData)) {
            if (key === 'folds') {
                formData.append(key, JSON.stringify(value));
                continue;
            }
            formData.append(key, String(value));
        }

        return async ({result}) => {
            loading = false;
            awaitingConfirmation = false;
            await applyAction(result);
        }
    }

    $effect(() => {
        if (form?.toDelete !== undefined) {
            untrack(() => {
                const ix = editorSocials.state.findIndex((social: typeof editorSocials.state[number]) => {
                    social.name === form?.toDelete
                });
                editbar.focused = '';
                editorSocials.state.splice(ix, 1);
                form.toDelete = undefined;
            })
        }
    })

    const assignInputBindingsWithExceptions = (v: any, key: string) => {
        if (key === 'fold_count' && isNaN(v)) return null;
        if (key === 'name') {
            if (v === '') {
                v = 'none';
            }

            editorSocials.state[editbar.focusedIx][key] = v;
            editbar.focused = v;
            return;
        }
        editorSocials.state[editbar.focusedIx][key] = key.startsWith('type_') ? v : convertSimpleDataTypesImplicitly(v);
    }

    const assignFoldBindingsWithExceptions = (v: any, ig: number, key: string) => {
        editorSocials.state[editbar.focusedIx].folds[ig][key] = convertSimpleDataTypesImplicitly(v);

    }
</script>

<svelte:window onclick={checkIfClose}/>
<aside bind:this={sidebarElem} class="sidebar">
    {#if editbar.focused !== '' && editbar.focusedIx !== -1}
        <h2>{readOnlySocial.name}</h2>
        <form method="POST" use:enhance={handleSubmit}>
            {#if activeEditor.state === 'lnkt-modifying' && !isEmptyArr(editorSocials.state)}
                {#each Object.keys(readOnlySocial).filter((key: String) => key !== 'folds')
                        as key (key + '_salt143')}
                    {@const readOnlyVal = editorSocials.state[editbar.focusedIx][key]}
                    {@const isInvalidFoldCount = isNumberInvalid(key, 'fold_count', readOnlyVal, MAX_CHIME_FOLDS)}
                    <label>
                        {key}
                        <input bind:value={() => editorSocials.state[editbar.focusedIx][key], (v) => {assignInputBindingsWithExceptions(v, key)}}
                               placeholder={editorSocials.state[editbar.focusedIx][key]}
                               class={`${isInvalidFoldCount ? 'invalid-bg' : ''}`}>
                    </label>
                    {#if key === 'separator_shape'}
                        <small>Out of:
                            {#each Object.keys(SeparatorShape) as shape (shape + "_salt243")}{`${shape}, `}{/each}
                        </small>
                    {/if}
                {/each}
                <p><b>Folds:</b></p>
                {#each readOnlySocial.folds as roFold, ig (roFold.slug)}
                    <p><b>{roFold.slug}</b></p>
                    {#each Object.keys(roFold) as key (key + '_salt173')}
                        <label>
                            {key}
                            <input bind:value={() => editorSocials.state[editbar.focusedIx].folds[ig][key], (v) => assignFoldBindingsWithExceptions(v, ig, key)}
                                   placeholder={roFold[key]}>
                        </label>
                    {/each}
                {/each}
                <button formaction="admin/edits?/postSocial">
                    {postText}
                </button>
                {#if form?.message !== undefined}
                    <p class={form?.success === false ? 'invalid-txt' : 'valid-txt'}>{form?.message}</p>
                {/if}
                <details>
                    <summary>Delete</summary>
                    <button class="delete-button" formaction="admin/edits?/deleteSocial">
                        {deleteText}
                    </button>
                </details>
            {/if}
        </form>
    {/if}
</aside>

<style>
    .delete-button {
        margin-top: 20rem;
    }

    .invalid-bg {
        background-color: #e64a3d;
    }

    .invalid-txt {
        font-weight: bold;
        color: #e64a3d;
    }

    .valid-txt {
        font-weight: bold;
        color: #3de68c;
    }

    aside {
        position: fixed;
        right: 0;
        top: 0;
        z-index: 10000000;

        width: 28vw;
        height: 100vh;

        box-sizing: border-box;
        padding: 1rem 1rem 2rem 2rem;

        border-left: 1px solid black;
        background: rgba(255, 255, 255, 0.3);
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(2px);
        -webkit-backdrop-filter: blur(2px);

        overflow-y: auto;
        overflow-x: hidden;

        &:hover {
            cursor: default;
        }

        & h2 {
            padding-bottom: 1rem;
        }

        & form {
            display: flex;
            flex-direction: column;

            gap: 0.5rem;

            & small {
                text-wrap: wrap;
                white-space: wrap;
            }

            & label {
                display: flex;

                & input {
                    margin-left: auto;
                }
            }
        }
    }
</style>