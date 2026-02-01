<script lang="ts">
    import {currentLang, editbar, modal, hackeryAnimObserver, t} from "$lib/shared.svelte";
    import RotatieCard from "$lib/RotatieCard.svelte";
    import EditorTools from "$lib/editing/EditorTools.svelte";
    import {onMount} from "svelte";
    import WebProjModal from "$lib/WebProjModal.svelte";

    const {webProj: webProjProp, webProjDetails: webProjDetailsProp} = $props();

    const webProj: Array<Record<string, any>> = $derived(editbar.proj_data);
    const webProjDetails: Array<Record<string, any>> = $derived(editbar.proj_details_data);
    const findSelectedProj = () => {
        if (!webProj) return null;

        const sel = webProj.find(p => p.name === modal.selected)
        if (sel === null) return null;

        return sel;
    }
    const selectedProj = $derived.by(findSelectedProj);
    const findSelectedDetails = () => {
        if (!webProjDetails) return null;

        const sel = webProjDetails.find(p => p.name === modal.selected)
        if (sel === undefined) return null;


        return sel;
    }
    const selectedDetails = $derived.by(findSelectedDetails);
    const findSelectedIx = () => {
        if (!webProjDetails) {
            modal.selectedIx = -1;
            return;
        }

        const ix = webProjDetails.findIndex(p => p.name === modal.selected)
        if (ix === undefined) {
            modal.selectedIx = -1;
            return;
        }

        modal.selectedIx = ix;
    }
    $effect(findSelectedIx);

    onMount(() => {
        editbar.proj_data = webProjProp;
        editbar.proj_details_data = webProjDetailsProp;
        modal.selected = editbar.proj_details_data[0].name;
    })

    $effect(() => {
        if (!modal.open) {
            document.documentElement.classList.remove('scroll-lock');
        }
    })

    let webTxtElem: HTMLElement | null = $state(null);

    onMount(() => {
        if (!webTxtElem || !hackeryAnimObserver) return;
        webTxtElem.dataset.speed = "0.3"
        hackeryAnimObserver.observe(webTxtElem);
    })
</script>

{#key currentLang.lang}
    <WebProjModal {selectedDetails} {selectedProj} {webProjDetails}/>
    <section class="web-seg" id="web">
        <EditorTools seg={'web'} light={true}/>
        <div class="web-txt-cont">
            <h2 class="web-txt web-head-txt">Web /></h2>
            <p bind:this={webTxtElem} class="web-txt web-desc-txt">{t.web_text_selected()}</p>
        </div>
        {#each webProj as proj, i (proj.name)}
            <RotatieCard {proj} ix={i}/>
        {/each}

        <div class="guideline">
            <div class="circle"></div>
            <div class="outer"></div>
            <div class="inner"></div>
        </div>
    </section>

    <style>
        .web-seg {
            height: 300vh;
            width: 100vw;
            position: relative;

            background-color: var(--seg-web-bg);

            color: white;

            @media (max-width: 1023px) {
                display: flex;
                flex-direction: column;
                align-items: center;

                gap: 12vh;
            }
            @media (max-width: 400px) {
                height: 320vh;
            }

            & *::selection {
                color: black;
                background-color: white;
            }

            & .web-txt-cont {
                position: absolute;
                top: 6rem;
                left: 5rem;
                display: grid;
                gap: 0.4rem;

                @media (max-width: 1023px) {
                    left: 1.5rem;
                }

                & .web-head-txt {
                    opacity: 0.7;
                    font-family: "Montserrat", sans-serif;

                    /* *tries not to giggle/die really hard* */
                    transform: scaleX(1.05);
                    transform-origin: top left;
                    font-weight: 200;
                    font-size: 1.5rem;
                }

                & .web-desc-txt {
                    opacity: 0.7;
                    font-size: 2rem;
                    font-family: "Fira Mono", monospace;

                    @media (max-width: 450px) {
                        font-size: 1.5rem;
                    }
                }
            }

            & .guideline {
                position: absolute;
                right: 15%;

                --guideline-width: 0.09375rem;
                --outer-height: 20vh;
                --circle-diameter: calc(var(--guideline-width) * 10);
                width: var(--circle-diameter);
                height: calc(100% + var(--outer-height));
                display: flex;
                flex-direction: column;
                place-items: center start;

                margin-top: calc((var(--outer-height) * -1) - var(--circle-diameter));
                box-sizing: border-box;

                & .circle {
                    border-radius: 50%;
                    width: 100%;
                    height: var(--circle-diameter);
                    aspect-ratio: 1 / 1;
                    position: relative;

                    box-sizing: border-box;
                    border: 0.1rem solid #111111;
                    margin-left: 0.05rem;
                }

                & .outer {
                    width: var(--guideline-width);
                    height: var(--outer-height);

                    background-color: #111111;
                }

                & .inner {
                    width: var(--guideline-width);
                    height: 100%;

                    background-color: #6728b3;
                }
            }
        }
    </style>
{/key}