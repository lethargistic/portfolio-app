<script lang="ts">
    import SegWelcome from "$lib/segments/SegWelcome.svelte";
    import SegAbout from "$lib/segments/SegAbout.svelte";
    import SegLinktree from "$lib/segments/SegLinktree.svelte";
    import {goto} from "$app/navigation";
    import {activeEditor, editing, editorMode, sidebar} from "$lib/shared.svelte";
    import GlobalEditorTools from "$lib/editing/GlobalEditorTools.svelte";

    let {data} = $props();

    const cheatCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight'];
    let codeIx = 0;
    const maxDelay = 3000;
    let past = Date.now();

    const handleTravelToAuth = (e: KeyboardEvent) => {
        const now = Date.now();

        if (now - past > maxDelay) {
            codeIx = 0;
        }

        past = now;

        if (e.key === cheatCode[codeIx]) {
            codeIx++;
            if (codeIx === cheatCode.length) {
                goto('/admin/login');
                codeIx = 0;
            }
        } else {
            codeIx = 0;
        }
    }
</script>
<svelte:window on:keydown={handleTravelToAuth}/>

{#if editing.state && editorMode.state}
    <div class="editing">
        <p>Editing</p>
        <small>{activeEditor.state}</small>
    </div>
{/if}
<GlobalEditorTools/>
<main>
    <SegWelcome/>
    <SegAbout/>
    <SegLinktree socials={data.socials}/>
</main>
{#each Array.from({length: 100}) as _, i }
    <p>{i}</p>
{/each}

<style>
    .editing {
        position: fixed;
        color: white;
        background-color: black;
        padding: 0.8rem 1.2rem;
        z-index: 9999999;

        opacity: 0.5;

        font-size: 2rem;
        left: 28px;
        top: 100px;
    }
</style>