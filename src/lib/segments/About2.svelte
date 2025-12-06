<script lang="ts">

    import {currentLang} from "$lib/shared.svelte";
</script>

{#key currentLang}
    <section class="about-seg" id="about">
        <div class="decor-waterfall decor-waterfall-upper"></div>
        <div class="decor-waterfall decor-waterfall-lower"></div>
        <div class="char-sheet">
            <div class="infobloc">
                <div class="infobloc-inner">
                    <p class="blurb">me lines</p>
                    <p>me more lines</p>
                    <!-- more lines -->
                </div>
            </div>
            <div class="pfpbloc">
                <img class="pfp" src="img/pfp.webp" alt="maksiks profile pic, an overloaded letter M mostly">
                <div class="pfp-info"></div>
            </div>
        </div>
    </section>

    <style>
        .about-seg {
            height: 110vh;
            width: 100vw;
            position: relative;

            & .decor-waterfall {
                background-color: #212121;

                position: absolute;
                width: 44px;
                height: 40%;
            }

            & .decor-waterfall-upper {
                top: 0;
                left: 40%;
            }

            & .decor-waterfall-lower {
                top: 60%;
                left: 20%;
            }

            & .char-sheet {
                width: 100vw;
                box-sizing: border-box;
                padding: 6vw 3rem 0 3rem;

                display: flex;
                flex-direction: row;

                & .infobloc {
                    width: 60%;
                    height: 67vh;

                    position: relative;
                    z-index: 10;

                    background-color: #ffffff;
                    border: 4px solid #1b1b1b;

                    & .infobloc-inner {
                        width: 100%;
                        height: 100%;

                        box-sizing: border-box;
                        padding: 1rem;

                        background-color: #212121;
                        /* works surprisingly well */
                        box-shadow: inset 0 0 0 1rem white;
                    }
                }

                & .pfpbloc {
                    display: flex;
                    flex-direction: column;
                    width: 40%;

                    & .pfp {
                        margin-left: auto;
                        width: 300px;
                        aspect-ratio: 1/1;

                        border: 4px solid #1b1b1b;
                    }
                }
            }
        }
    </style>
{/key}