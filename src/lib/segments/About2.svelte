<script lang="ts">
    import {currentLang} from "$lib/shared.svelte";
    import {m} from "../paraglide/messages";
    import {onMount} from "svelte";

    const blurbs = $derived.by(() => {
        return Object.keys(m)
            .filter(key => key.startsWith("about_l_"))
            .sort((a, b) => a.localeCompare(b, undefined, {numeric: true}))
            .map(key => m[key as keyof typeof m]());
    })

    let init = $state(false)
    onMount(() => {
        init = true
    })
</script>

{#key currentLang.lang}
    <section class="about-seg" id="about">
        <div class="decor-waterfall decor-waterfall-upper"></div>
        <div class="decor-waterfall decor-waterfall-lower"></div>
        <div class="char-sheet">
            {#if init}
                <div class="infobloc">
                    <div class="infobloc-inner">
                        <p class="infobloc-chief-blurb">{@html m.about_info_upper().replace(":flag_ua:", `<img width="72" height="72" class="smol" src="/img/icon/flag_ua.webp" alt="Ukrainian flag"/>`)}</p>
                        <ul class="infobloc-blurbs">
                            {#each blurbs as blurb, i}
                                <li>
                                    <p>{@html blurb}</p>
                                </li>
                                {#if i % 2 === 0}
                                    <li class="infobloc-separator" aria-label="separator">
                                        <p>|</p>
                                    </li>
                                {/if}
                            {/each}
                        </ul>
                    </div>
                </div>
            {/if}
            <div class="pfpbloc-cont">
                <div class="pfpbloc">
                    <img class="pfp" src="img/pfp.webp" alt="maksiks profile pic, an overloaded letter M mostly">
                    <div class="pfp-info">
                        <img class="status-scrollwork" src="/img/wigglies.webp" alt="wiggly fantasy scrollwork">
                        <p class="status-hp">{m.about_pfp_hp()}</p>
                        <p class="status-info">{@html m.about_pfp_info()}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div class="train-cont">
            <img class="train train-front" src="/img/train_front.png" alt="a literal train">
            <img class="train train-middle" src="/img/train_middle.png" alt="a literal train">
            <img class="train-tracks" src="/img/tracks.png" alt="train tracks">
        </div>
    </section>

    <style>
        .about-seg {
            height: 130vh;
            width: 100vw;
            position: relative;

            background-color: white;

            & .train-cont {
                & .train {
                    width: 100%;
                    height: 20vh;
                }


            }

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

                        & p::selection {
                            color: black;
                            background-color: white;
                        }

                        display: flex;
                        flex-direction: column;

                        box-sizing: border-box;
                        --white-padding-size: 1rem;
                        padding: calc(var(--white-padding-size) + 2rem) calc(var(--white-padding-size) + 1.5rem);
                        font-size: 1.2rem;

                        color: white;
                        background-color: #212121;
                        /* works surprisingly well */
                        box-shadow: inset 0 0 0 var(--white-padding-size) white;

                        & .infobloc-chief-blurb {
                            line-height: 1.8;
                        }

                        & .infobloc-blurbs {
                            margin-top: auto;
                            list-style: none;
                            display: grid;
                            grid-template-columns: 1fr 10% 1fr;
                            grid-template-rows: repeat(5, 1fr);

                            row-gap: 0.3rem;

                            & .infobloc-separator {
                                user-select: none;
                                text-align: center;
                            }
                        }
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
                        font-size: 1.1rem;

                        & .pfp {
                            width: 260px;
                            aspect-ratio: 1/1;

                            user-select: none;

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

                            & .status-scrollwork {
                                padding: 1rem 0 0 0;
                                width: 100%;
                                user-select: none;
                            }

                            & .status-info {
                                text-align: center;
                                padding-top: 1.5rem;
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