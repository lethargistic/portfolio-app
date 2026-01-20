<script lang="ts">
    import {currentLang, editbar} from "$lib/shared.svelte";
    import RotatieCard from "$lib/RotatieCard.svelte";
    import EditorTools from "$lib/editing/EditorTools.svelte";
    import {onMount} from "svelte";

    const {webProj: webProjProp} = $props();

    const webProj = $derived(editbar.proj_data);

    onMount(() => {
        editbar.proj_data = webProjProp;
    })
</script>

{#key currentLang.lang}
    <section class="web-seg" id="web">
        <EditorTools seg={'web'} light={true}/>
        <div class="web-txt-cont">
            <h2 class="web-txt web-head-txt">Web /></h2>
            <p class="web-txt web-desc-txt">Selected web projects I've built</p>
        </div>
        {#each webProj as proj}
            <RotatieCard {proj}/>
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

            background-color: #1a171e;

            color: white;

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

                & .web-head-txt {
                    opacity: 0.7;
                    font-family: "Montserrat", sans-serif;

                    /* *tries not to giggle really hard* */
                    transform: scaleX(1.05);
                    transform-origin: top left;
                    font-weight: 200;
                    font-size: 1.5rem;
                }

                & .web-desc-txt {
                    opacity: 0.7;
                    font-size: 2rem;
                    font-family: "Fira Mono", monospace;
                }
            }

            & .guideline {
                position: absolute;
                right: 15%;

                --guideline-width: 0.09375rem;
                --outer-height: 20vh;
                --circle-diameter: calc(var(--guideline-width) * 10);
                width: var(--circle-diameter);
                height: 100%;
                display: flex;
                flex-direction: column;
                place-items: center start;

                margin-top: calc((var(--outer-height) * -1) - var(--circle-diameter));

                & .circle {
                    border-radius: 50%;
                    width: 100%;
                    height: var(--circle-diameter);
                    aspect-ratio: 1 / 1;
                    position: relative;

                    box-sizing: border-box;
                    border: 0.1rem solid #111111;
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