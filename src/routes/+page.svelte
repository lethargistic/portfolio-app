<script lang="ts">
    import SegWelcome from "$lib/segments/SegWelcome.svelte";
    import SegAbout from "$lib/segments/SegAbout.svelte";
    import SegLinktree from "$lib/segments/SegLinktree.svelte";
    import {goto} from "$app/navigation";
    import {activeEditor, editing, settings} from "$lib/shared.svelte";
    import GlobalEditorTools from "$lib/editing/GlobalEditorTools.svelte";

    let {form, data} = $props();

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

    //

    let pulledSettings = $state(false);
    const manageSettings = () => {
        if (pulledSettings) {
            localStorage.setItem('settings', JSON.stringify(settings));
        } else {
            const oldSettings = localStorage.getItem('settings');

            console.log(oldSettings);
            if (!oldSettings) {
                pulledSettings = true;
                return;
            }
            const oldSettingsJSON = JSON.parse(oldSettings);
            const settingsKeys = Object.keys(settings);

            for (const [key, value] of Object.entries(oldSettingsJSON as typeof settings)) {
                if (!settingsKeys.includes(key)) continue;
                settings[key].state = value.state;
            }

            pulledSettings = true;
        }

    }
    $effect(manageSettings);
</script>
<svelte:window on:keydown={handleTravelToAuth}/>

{#if editing.state && settings.editor.state}
    <div class="editing">
        <p>Editing</p>
        <small>{activeEditor.state}</small>
    </div>
{/if}
<GlobalEditorTools {form}/>
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