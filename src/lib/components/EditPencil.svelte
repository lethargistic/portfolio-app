<script lang="ts">
    import {editing, editorMode} from "$lib/shared.svelte";

    let {left = false, light = false, linktree = false} = $props();

    // wow i just realized i like a lambda like this more than making it inline to keep the template clean
    const flipEditing = () => editing.state = !editing.state;
</script>

{#if editorMode.state}
    <div class={`editor-tools ${left ? 'left' : 'right'}`}>
        <button onclick={flipEditing}>
            <img class={light ? 'light' : ''} src="/img/icons/lucide-edit.svg" alt="edit">
        </button>
        {#if linktree}
            <button onclick={flipEditing}>
                <img class={light ? 'light' : ''} src="/img/icons/lucide-plus.svg" alt="edit">
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
