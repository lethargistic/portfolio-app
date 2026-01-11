<script lang="ts">
    import {activeEditor, editing, editorMode, sidebar} from "$lib/shared.svelte";
    import EditorSidebar from "$lib/editing/EditorSidebar.svelte";

    let {left = false, light = false, linktree = false} = $props();

    let bodyElem: HTMLBodyElement | null = $state(null);

    const flipEditing = () => editing.state = !editing.state;
    const changeEditor = (s: string) => {
        editing.state = true;
        activeEditor.state = s;
    }

    const editIconPath = '/img/icons/lucide-edit.svg';
    const modifyIconPath = '/img/icons/lucide-modify.svg';
    const plusIconPath = '/img/icons/lucide-plus.svg';
    const moveIconPath = 'img/icons/lucide-move.svg';
    $effect(() => {
        if (!bodyElem) return;

        if (editorMode.state && editing.state && activeEditor.state.endsWith('positioning')) {
            bodyElem.style.cursor = `url("${moveIconPath}"), auto`;
        } else if (editorMode.state && editing.state && activeEditor.state.endsWith('modifying')) {
            bodyElem.style.cursor = `url("${modifyIconPath}"), auto`;
        } else {
            bodyElem.style.cursor = "default";
        }
    })
</script>

<svelte:body bind:this={bodyElem} />

{#if editorMode.state}
    {#if sidebar.open}
        <EditorSidebar/>
    {/if}

    <div class={`editor-tools ${left ? 'left' : 'right'}`}>
        <button onclick={flipEditing}>
            <img class={light ? 'light' : ''} src={editIconPath} alt="edit">
        </button>
        {#if linktree}
            <button onclick={() => {changeEditor('lnkt-adding')}}>
                <img class={light ? 'light' : ''} src={plusIconPath} alt="add">
            </button>
            <button onclick={() => {changeEditor('lnkt-positioning')}}>
                <img class={light ? 'light' : ''} src={moveIconPath} alt="move">
            </button>
            <button onclick={() => {changeEditor('lnkt-modifying')}}>
                <img class={light ? 'light' : ''} src={modifyIconPath} alt="edit">
            </button>
        {/if}
    </div>

    <style>
        .light {
            filter: invert(1);
        }

        .left {
            left: 28px;
        }

        .right {
            right: 28px;
            flex-direction: row-reverse;
        }

        .editor-tools {
            position: absolute;
            z-index: 9999999;
            top: 30px;
            width: 42px;
            height: 40px;

            display: flex;
            gap: 1rem;

            button {
                all: unset;
                cursor: pointer;

                display: flex;
                justify-content: center;
                align-items: center;

                & img {
                    width: 24px;
                    height: 24px;
                    aspect-ratio: 1/1;
                }
            }
        }
    </style>
{/if}
