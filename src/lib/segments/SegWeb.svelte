<script lang="ts">
    import {currentLang} from "$lib/shared.svelte";
</script>

{#key currentLang.lang}
    <section class="web-seg" id="web">
        <div class="web-txt-cont">
            <h2 class="web-txt web-head-txt">Web /></h2>
            <p class="web-txt web-desc-txt">Selected web projects I've built</p>
        </div>
        <div class="guideline"></div>
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
                    font-family: "Fira Mono", sans-serif;
                }
            }

            & .guideline {
                position: absolute;
                right: 15%;

                width: 1px;
                height: 100%;

                background-color: #441d80;
            }
        }
    </style>
{/key}