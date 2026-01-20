<!--get, set bindings-->
<!--suppress CommaExpressionJS -->
<script lang="ts">
    import {activeEditor, MAX_CHIME_FOLDS, editbar} from "$lib/shared.svelte";
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

    //

    const socialInQuestion = $derived<Record<string, any>>(editbar.social_data[editbar.focusedIx]);
    const projInQuestion = $derived<Record<string, any>>(editbar.proj_data[editbar.focusedIx]);

    const isNumberInvalid = (key: string, trueKey: string, value: any, upperBound: number) => {
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

        formData.delete('*');

        const curData = activeEditor.state.startsWith('lnkt') ? socialInQuestion :
            activeEditor.state.startsWith('web') ? projInQuestion : null;
        if (curData === null) {
            cancel();
            throw new Error('Current data is off');
        }
        for (const [key, value] of Object.entries(curData)) {
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
                const type = form.toDelete.type;
                const obj = editbar[`${type}_data`] ;
                const ix = obj.findIndex((social: typeof obj[number]) => {
                    social.name === form.toDelete.name
                });
                editbar.focused = '';
                obj.splice(ix, 1);
                form.toDelete = undefined;
            })
        }
    })

    const assignInputBindingsWithExceptions = (v: any, key: string) => {
        if (key === 'fold_count' && isNaN(v)) {
            return null;
        }
        if (key === 'name') {
            if (v === '') {
                v = 'none';
            }

            socialInQuestion[key] = v;
            editbar.focused = v;
            return;
        }
        socialInQuestion[key] = key.startsWith('type_') ? v : convertSimpleDataTypesImplicitly(v);
    }

    const assignFoldBindingsWithExceptions = (v: any, ig: number, key: string) => {
        socialInQuestion.folds[ig][key] = convertSimpleDataTypesImplicitly(v);
    }

    const isLnktMod = $derived(activeEditor.state === 'lnkt-modifying' && !isEmptyArr(editbar.social_data));
    const isWebMod = $derived(activeEditor.state === 'web-modifying' && !isEmptyArr(editbar.proj_data));
</script>

<svelte:window onclick={checkIfClose}/>
{#snippet sendingBloc(action: String)}
    <button formaction={`admin/edits?/post${action}`}>
        {postText}
    </button>
    {#if form?.message !== undefined}
        <p class={form?.success === false ? 'invalid-txt' : 'valid-txt'}>{form?.message}</p>
    {/if}
{/snippet}
{#snippet deletionBloc(action: String)}
    {#if activeEditor.state.endsWith('modifying')}
        <details>
            <summary>Delete</summary>
            <button class="delete-button" formaction={`admin/edits?/delete${action}`}>
                {deleteText}
            </button>
        </details>
    {/if}
{/snippet}
<aside bind:this={sidebarElem} class="sidebar">
    {#if editbar.focused !== '' && editbar.focusedIx !== -1}
        {#if isLnktMod}
            {@const action = "Social"}
            <h2>{socialInQuestion.name}</h2>
            <form method="POST" use:enhance={handleSubmit}>
                {#each Object.entries(socialInQuestion).filter(([key, _v]) => key !== 'folds') as [key, value] (key)}
                    {@const isInvalidFoldCount = isNumberInvalid(key, 'fold_count', value, MAX_CHIME_FOLDS)}
                    <label>
                        {key}
                        <input bind:value={() => socialInQuestion[key], (v) => assignInputBindingsWithExceptions(v, key)}
                               placeholder={socialInQuestion[key]}
                               class={`${isInvalidFoldCount ? 'invalid-bg' : ''}`}>
                    </label>
                    {#if key === 'separator_shape'}
                        <small>Out of:
                            {#each Object.keys(SeparatorShape) as shape (shape)}{`${shape}, `}{/each}
                        </small>
                    {/if}
                {/each}
                <p><b>Folds:</b></p>
                {#each socialInQuestion.folds as fold, ig (fold.slug)}
                    <p><b>{fold.slug}</b></p>
                    {#each Object.keys(fold) as key (key)}
                        <label>
                            {key}
                            <input bind:value={() => fold[key], (v) => assignFoldBindingsWithExceptions(v, ig, key)}
                                   placeholder={fold[key]}>
                        </label>
                    {/each}
                {/each}
                {@render sendingBloc(action)}
                {@render deletionBloc(action)}
            </form>

        {:else if isWebMod}
            {@const action = "Project"}
            <form method="POST" use:enhance={handleSubmit}>
                <!-- TODO: foreign key for insides instead of column array because ahh... eto bleh -->
                {#each Object.entries(projInQuestion) as [key, value] (key)}
                    <label>
                        {key}
                        <input bind:value={projInQuestion[key]}
                               placeholder={value}>
                    </label>
                {/each}

                {@render sendingBloc(action)}
                {@render deletionBloc(action)}
            </form>
        {/if}
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