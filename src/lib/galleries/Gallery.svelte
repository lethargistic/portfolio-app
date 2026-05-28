<script lang="ts">
    import {blur} from "svelte/transition";

    const {groups, data} = $props();
    const imgs = $derived(data.signedUrls)

    let open = $state(false);
    let selected: typeof imgs[number] = $state(null);

    let groupedImgs: Array<Record<string, any>> = [];
    for (const img of imgs) {
        for (const [key, _] of Object.entries(groups)) {
            if (img.name.startsWith(key + "_")) {
                groupedImgs.push({"group": key, "obj": img});
            }
        }
    }
</script>

<svelte:head>
    <title>Certificates</title>
    <meta name="robots" content="noindex, nofollow">
</svelte:head>

{#if open && selected}
    <div transition:blur onclick={() => {open = false;}}
         onkeydown={() => {open = false;}}
         role="button"
         aria-label="img modal" tabindex="0"
         class={`lightbox ${selected ? 'lightbox-visible' : 'lightbox-hidden'}`}>
        <img src={selected.src} alt={selected.name}/>
    </div>
{/if}
<main>
    {#each Object.entries(groups) as [key, header] (key)}
        {#if key.startsWith('comp')}
            <h3>{header}</h3>
        {:else}
            <h2>{header}</h2>
            <h3>⤷ Certificates</h3>
        {/if}

        <div class="gallery">
            {#each groupedImgs as img}
                {#if img.group === key}
                    <div onclick={() => {open = true; selected = img.obj;}}
                         onkeydown={() => {open = true; selected = img.obj;}}
                         role="button" tabindex="0">
                        <img src={img.obj.src} alt={"certificate image: " + img.obj.name}/>
                    </div>
                {/if}
            {/each}
        </div>
    {/each}
</main>

<style>
    .lightbox {
        position: fixed;
        left: 0;
        top: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.7);
        z-index: 999;

        display: grid;
        place-items: center;

        & img {
            width: auto;
            max-width: 90vw;
            max-height: 90vh;

            user-select: none;
            user-drag: none;
            -webkit-user-drag: none;
        }
    }

    main {
        width: 100vw;

        display: grid;
        background-color: #232323;
        height: max-content;
        overflow-y: auto;
        box-sizing: border-box;
        padding: 1rem 2rem;

        & h2, h3 {
            color: white;
        }

        & h3 {
            padding-top: 1rem;
            padding-left: 1.5rem;
        }
    }

    .gallery {
        width: 100%;

        columns: 23vw;
        box-sizing: border-box;

        padding: 1rem 0.5rem 0 0.5rem;

        & img {
            width: 100%;
            margin-bottom: 1rem;
            transition: filter 0.1s ease-in-out;
            user-select: none;
            user-drag: none;
            -webkit-user-drag: none;

            &:hover {
                cursor: pointer;
                filter: brightness(0.7);
            }
        }
    }
</style>