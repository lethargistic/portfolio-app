<script lang="ts">
    import {editing} from "$lib/shared.svelte";

    let {left = false, light = false} = $props();

    // wow i just realized i like a lambda like this more than making it inline to keep the template clean
    const startEditing = () => editing.state = true;
</script>

<button style={`${left ? 'left' : 'right'}: 20px`} onclick={startEditing}>
    <img style={light ? 'filter: invert(1);' : ''} src="/img/icons/lucide-edit.svg" alt="edit">
</button>

<style>
    button {
        all: unset;
        cursor: pointer;

        position: absolute;
        top: 30px;
        width: 42px;
        height: 40px;

        display: flex;
        justify-content: center;
        align-items: center;

        background: rgba(255, 255, 255, 0.01);
        backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(5px);
        box-shadow: rgba(0, 0, 0, 0.4) 0 2px 4px, rgba(0, 0, 0, 0.3) 0 7px 13px -3px, rgba(0, 0, 0, 0.2) 0 -3px 0 inset;
        margin-top: 2px;
        padding-bottom: 4px;
        transition: all 0.2s ease-in-out;
        &:hover {
            box-shadow: rgba(0, 0, 0, 0.4) 0 2px 4px, rgba(0, 0, 0, 0.3) 0 7px 13px -3px, rgba(0, 0, 0, 0.2) 0 -1px 0 inset;
            margin-top: 4px;
            padding-bottom: 2px;
        }

        & img {
            width: 24px;
            height: 24px;
            aspect-ratio: 1/1;
        }
    }
</style>