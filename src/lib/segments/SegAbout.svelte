<script lang="ts">
    import {currentLang, editorMode, fiend} from "$lib/shared.svelte";
    import {m} from "../paraglide/messages";
    import {onMount} from "svelte";
    import {Tween} from "svelte/motion";
    import {cubicInOut} from "svelte/easing";
    import EditPencil from "$lib/components/EditPencil.svelte";

    const blurbs = $derived.by(() => {
        return Object.keys(m)
            .filter(key => key.startsWith("about_l_"))
            .sort((a, b) => a.localeCompare(b, undefined, {numeric: true}))
            .map(key => m[key as keyof typeof m]());
    })

    let trainFrontElem: HTMLElement | null = $state(null)
    let trainMiddleElems: Array<HTMLElement | null> = $state([])
    let trainMiddleElemFirst: HTMLElement | null = $derived(trainMiddleElems[0])
    let trainMiddleElemSecond: HTMLElement | null = $derived(trainMiddleElems[1])

    const getTrainTween = (start: number, duration: number) => {
        return new Tween(start, {
            duration: duration,
            easing: cubicInOut
        })
    }

    let trainPos = $state(getTrainTween(0, 1000));

    let scrollY = $state(0);
    let innerHeight = $state(0);
    $effect(() => {
        if (!partOfS2visible && scrollY > innerHeight*0.65) {
            partOfS2visible = true;
        }
    })
    let partOfS2visible = $state(false);

    let passingBy = $state(false);
    let frontPass = $state(true);
    let juggler = $state(false);
    let ghostWagons = $state(0);
    const ghostWagonCap = 256;
    let passes = 0;
    const startRandomTick = () => {
        setInterval(() => {
            if (!partOfS2visible) return;
            if (passingBy) return;
            const chanceMult = passes < 1 ? 2 :
                passes < 2 ? 60
                    : 90;
            const roll = (Math.floor(Math.random() * chanceMult) == 0);
            if (!roll) return;
            passes++;
            passingBy = true;

            startTrainAnim();
        }, 1000)
    }

    const trainPosTarget = 500;
    const startTrainAnim = () => {
        if (!trainFrontElem || !trainMiddleElemFirst || !trainMiddleElemSecond) return;
        trainPos.target = trainPosTarget;
    }

    $effect(() => {
        if (trainPos.current == trainPosTarget) {
            passingBy = false;
            ghostWagons = 0;
            frontPass = true;
            trainPos.target = 0;
            trainPos = getTrainTween(0, 1000);
        }

        if (ghostWagons >= ghostWagonCap) {
            return;
        }

        if (trainPos.current > 300) {
            trainPos.target = 0;
            frontPass = false;
            ghostWagons++;
            juggler != juggler;
            trainPos = getTrainTween(200, 100);
            startTrainAnim();
        }
    })

    onMount(() => {
        startRandomTick();
    })
</script>

<svelte:window bind:scrollY={scrollY} bind:innerHeight={innerHeight} />

{#key currentLang.lang}
    <section class="about-seg" id="about">
        {#if editorMode.state}<EditPencil/>{/if}
        <div class="decor-waterfall decor-waterfall-upper"></div>
        <div class="decor-waterfall decor-waterfall-lower"></div>
        <div class="char-sheet">
            <div style={passingBy ? `animation: shake 0.5s infinite ease-in-out` : ``} class="infobloc">
                <div class="infobloc-inner">
                    <p class="infobloc-chief-blurb">{@html m.about_info_upper().replace(":flag_ua:", `<img width="72" height="72" class="smol" src="/img/icons/flag_ua.webp" alt="Ukrainian flag"/>`)}</p>
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
            <div style={passingBy ? `animation: shake 0.5s infinite ease-in-out` : ``} class="pfpbloc-cont">
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
            <img loading="lazy" style={`left: ${100-trainPos.current}vw; opacity: ${frontPass ? "100" : "0"};`}
                 class="train train-front" bind:this={trainFrontElem} src="/img/train_front.webp" alt="a literal train">
            {#each Array.from({length: 2}) as _, i}
                <img loading="lazy"
                     style={i === 0 ? `left: ${((juggler && ghostWagons < ghostWagonCap) ? 300 : 200)-trainPos.current}vw` : `left: ${((juggler && ghostWagons < ghostWagonCap) ? 200 : 300)-trainPos.current}vw`}
                     class="train train-middle" bind:this={trainMiddleElems[i]} src="/img/train_middle.webp"
                     alt="a literal train">
            {/each}
            <img loading="lazy" style={`left: ${400-trainPos.current}vw`}
                 class="train train-back" bind:this={trainFrontElem} src="/img/train_front.webp" alt="a literal train">
            <img loading="lazy" class="train-tracks" src="/img/tracks.webp" alt="train tracks">
        </div>
    </section>

    <style>
        .about-seg {
            height: 160vh;
            width: 100vw;
            position: relative;

            background-color: white;

            & .train-cont {
                margin-top: 20vh;
                position: relative;
                z-index: 20;

                & .train {
                    user-select: none;
                    width: 100%;
                    height: 20vh;
                }

                & .train-front {
                    /* relative so it shifts the layout, do not display: none 3 am me please */
                    position: relative;
                    left: 100vw;
                }

                & .train-back {
                    transform: scaleX(-1);
                    position: absolute;
                    top: 0;
                    left: 400vw;
                }

                & .train-middle {
                    position: absolute;
                    left: 200vw;
                    top: 0;
                }

                & .train-tracks {
                    user-select: none;
                    width: 100%;
                    margin-top: -10px;
                }
            }

            & .decor-waterfall {
                background-color: #212121;

                position: absolute;
                width: 44px;
            }

            & .decor-waterfall-upper {
                top: 0;
                left: 40%;
                height: 40%;
            }

            & .decor-waterfall-lower {
                top: 50%;
                left: 20%;
                height: 60%;
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

                        & img::selection {
                            background-color: transparent;
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

        @keyframes shake {
            0% {
                transform: translate(1px, 1px) rotate(0deg);
            }
            10% {
                transform: translate(-1px, -2px) rotate(-0.5deg);
            }
            20% {
                transform: translate(-3px, 0px) rotate(0.5deg);
            }
            30% {
                transform: translate(3px, 2px) rotate(0deg);
            }
            40% {
                transform: translate(1px, -1px) rotate(0.5deg);
            }
            50% {
                transform: translate(-1px, 2px) rotate(-0.5deg);
            }
            60% {
                transform: translate(-3px, 1px) rotate(0deg);
            }
            70% {
                transform: translate(3px, 1px) rotate(-0.5deg);
            }
            80% {
                transform: translate(-1px, -1px) rotate(0.5deg);
            }
            90% {
                transform: translate(1px, 2px) rotate(0deg);
            }
            100% {
                transform: translate(1px, -2px) rotate(-0.5deg);
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