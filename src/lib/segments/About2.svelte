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
            <div class="pfpbloc-cont">
                <div class="pfpbloc">
                    <img class="pfp" src="img/pfp.webp" alt="maksiks profile pic, an overloaded letter M mostly">
                    <div class="pfp-info">
                        <p class="status-hp">maksiks | hp: 85% | mana: 5%</p>
                        <img class="status-wigglies" src="/img/wiggliess.webp" alt="wiggly fantasy ornament">
                        <p class="status-info">
                            class: wizard extraordinaire<br>
                            alignment: chaotic evil<br>
                            elements: glyphs, shadow, light<br>
                            status effects: sleepy</p>
                    </div>
                </div>
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

                & .pfpbloc-cont {
                    display: flex;
                    justify-content: center;
                    width: 40%;

                    & .pfpbloc {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        width: 406px;

                        & .pfp {
                            width: 260px;
                            aspect-ratio: 1/1;

                            position: relative;
                            top: -10px;
                            animation: float 1.5s infinite ease-in-out alternate;

                            &:hover {
                                animation: float 1.5s infinite paused ease-in-out alternate;
                            }

                            border: 4px solid #1b1b1b;
                        }

                        & .pfp-info {
                            box-sizing: border-box;

                            display: flex;
                            flex-direction: column;

                            & .status-hp {
                                padding: 1rem 0 0 0;
                                text-align: center;
                            }

                            & .status-wigglies {
                                padding: 1rem 0 0 0;
                                width: 100%;
                            }

                            & .status-info {
                                text-align: center;
                                padding-top: 1rem;
                            }
                        }
                    }
                }
            }
        }

        @keyframes float {
            0% {
                transform: translateY(10px);
            }
            100% {
                transform: translateY(-10px);
            }
        }
    </style>
{/key}