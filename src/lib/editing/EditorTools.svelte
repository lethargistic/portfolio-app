<script lang="ts">
    import {
        activeEditor, editbar,
        editing,
        MAX_CHIME_FOLDS, settings
    } from "$lib/shared.svelte";
    import {Editable} from "$lib/utils/utils";

    let {left = false, light = false, seg} = $props();

    const flipEditing = () => {
        editing.state = !editing.state;
        if (editing.state === false) {
            activeEditor.state = '';
        }
    }
    const changeEditor = (s: string) => {
        editing.state = true;
        activeEditor.state = s;
    }

    // lazy-ish (not really) but this admin-only so I don't see why not
    const trackPreprocessEditorAdding = () => {
        if (activeEditor.state === 'lnkt-adding') {
            const socialSchem = Object.entries(editbar.social_data[0])
            const defaultSocial = Object.fromEntries(socialSchem.map(([key, value]) => {
                // exceptions
                if (key === 'fold_count') {
                    value = MAX_CHIME_FOLDS;
                    return [key, value];
                }
                if (key === 'folds') {
                    const valueArr: Array<Record<string, any>> = value as Array<Record<string, any>>;
                    for (let i = MAX_CHIME_FOLDS - valueArr.length; i > 0; i -= 1) {
                        valueArr.push(valueArr[0]);
                    }
                    return [key, valueArr];
                }

                // defaulting
                if (typeof value === "string") {
                    value = 'non';
                }
                if (typeof value === "number") {
                    // exceptions
                    if (key === 'chime_max_height_vh') return [key, 82];
                    if (key === 'chime_y_offset') return [key, 0.1];

                    value = 1;
                }
                return [key, value];
            }));
            editbar.social_data.push(defaultSocial);
            activeEditor.state = '';
        } else if (activeEditor.state === 'web-adding') {
            const projSchem = Object.entries(editbar.proj_data[0])
            const defaultProj = Object.fromEntries(projSchem.map(([key, value]) => {
                if (key === 'img') {
                    value = 'https://picsum.photos/1920/1080';
                    return [key, value];
                }

                // defaulting
                if (typeof value === "string") {
                    value = 'non';
                }
                if (typeof value === "number") {
                    // exceptions
                    if (key === 'width_vw') return [key, 30];

                    value = 1;
                }
                return [key, value];
            }));
            editbar.proj_data.push(defaultProj);
            activeEditor.state = '';
        }
    }
    $effect(trackPreprocessEditorAdding);

    const editIconPath = '/img/icons/lucide-edit.svg';
    const modifyIconPath = '/img/icons/lucide-modify.svg';
    const plusIconPath = '/img/icons/lucide-plus.svg';
    const moveIconPath = 'img/icons/lucide-move.svg';
</script>

{#if settings.editor.state}
    <div class={`editor-tools ${left ? 'left' : 'right'}`}>
        {#if Object.values(Editable).includes(seg) }
            <button onclick={flipEditing}>
                <img class={light ? 'light' : ''} src={editIconPath} alt="edit">
            </button>
        {/if}
        {#snippet genericItemEditors(prefix: String)}
            <button onclick={() => {changeEditor(`${prefix}-adding`)}}>
                <img class={light ? 'light' : ''} src={plusIconPath} alt="add">
            </button>
            <button onclick={() => {changeEditor(`${prefix}-positioning`)}}>
                <img class={light ? 'light' : ''} src={moveIconPath} alt="move">
            </button>
            <button onclick={() => {changeEditor(`${prefix}-modifying`)}}>
                <img class={light ? 'light' : ''} src={modifyIconPath} alt="edit">
            </button>
        {/snippet}
        {#if seg === 'linktree'}
            {@render genericItemEditors('lnkt')}
        {:else if seg === 'web'}
            {@render genericItemEditors('web')}
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
