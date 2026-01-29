<script lang="ts">
    import {currentLang, settings} from "$lib/shared.svelte";
    import {m} from "../paraglide/messages";
    import {onMount} from "svelte";
    import {Tween} from "svelte/motion";
    import {cubicInOut} from "svelte/easing";
    import EditorTools from "$lib/editing/EditorTools.svelte";
    import {browser} from "$app/environment";

    const blurbs = $derived.by(() => {
        if (currentLang.lang) {
            // reactivity
        }
        return Object.keys(m)
            .filter(key => key.startsWith("about_l_"))
            .sort((a, b) => a.localeCompare(b, undefined, {numeric: true}))
            .map(key => m[key as keyof typeof m]());
    })

    let charSheetInView = $state(false);
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
        if (!partOfS2visible && scrollY > innerHeight * 0.65) {
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
            if (!charSheetInView) return;
            passes++;
            passingBy = true;

            startTrainAnim();
        }, 1000)
    }

    let soundPlaying = $state(false)
    let trainSound: HTMLAudioElement | null = null;
    if (browser) {
        trainSound = new Audio('/audio/bullet-train-asmr.wav');
    }
    $effect(() => {
        if (!trainSound || !trainFrontElem) return;
        if (scrollY) {
            // reactivity
        }

        const rect = trainFrontElem.getBoundingClientRect();
        const elementCenter = rect.top + rect.height / 2;
        const viewportCenter = innerHeight / 2;

        const distanceFromCenter = elementCenter - viewportCenter;

        const fadeZoneTop = innerHeight * 3;
        const fadeZoneBottom = innerHeight * 1.35;

        let volume = 1.0;

        if (distanceFromCenter < 0) {
            volume = Math.max(0, 1 - (Math.abs(distanceFromCenter) / fadeZoneBottom));
        } else if (distanceFromCenter > 0) {
            volume = Math.max(0, 1 - (distanceFromCenter / fadeZoneTop));
        }

        trainSound.volume = volume;
    })

    let soundStartTime = 0;
    $effect(() => {
        if (!trainSound) return;
        trainSound.muted = !settings.sounds.state;
        if (settings.sounds.state && passingBy) {
            if (trainSound.duration && isFinite(trainSound.duration)) {
                const elapsed = (Date.now() - soundStartTime) / 1000;
                trainSound.currentTime = elapsed % trainSound.duration;
            }
            trainSound.play();
        }
    })

    const trainPosTarget = 500;
    const startTrainAnim = async () => {
        if (!trainFrontElem || !trainMiddleElemFirst || !trainMiddleElemSecond) return;
        if (!soundPlaying && trainSound) {
            trainSound.muted = true;
            soundStartTime = Date.now();

            if (settings.sounds.state) {
                await trainSound.play()
                trainSound.muted = false;
            }
            soundPlaying = true;

            setTimeout(() => {
                trainPos.target = trainPosTarget;
            }, 50)
            setTimeout(() => {
                soundPlaying = false;
            }, trainSound.duration * 1000)
        } else if (soundPlaying) {
            return;
        } else {
            trainPos.target = trainPosTarget;
        }
    }

    $effect(() => {
        if (ghostWagons >= ghostWagonCap) {
            passingBy = false;
            ghostWagons = 0;
            frontPass = true;
            trainPos.target = 0;
            trainPos = getTrainTween(0, 1000);
            return;
        }

        if (trainPos.current > 300) {
            trainPos.target = 0;
            frontPass = false;
            ghostWagons++;
            juggler = !juggler;
            trainPos = getTrainTween(200, 100);
            trainPos.target = trainPosTarget
        }
    })

    onMount(() => {
        startRandomTick();
    })

    let charSheetElem: HTMLElement | null = $state(null)
    $inspect(charSheetElem)
    $effect(() => {
        if (!charSheetElem || !browser) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    charSheetInView = entry.isIntersecting;
                });
            },
            {threshold: 0.05}
        );

        observer.observe(charSheetElem);

        return () => observer.disconnect();
    })
</script>

<svelte:window bind:scrollY={scrollY} bind:innerHeight={innerHeight}/>

{#key currentLang.lang}
    <section class="about-seg" id="about">
        <EditorTools seg='about'/>
        <div class="decor-waterfall decor-waterfall-upper"></div>
        <div class="decor-waterfall decor-waterfall-lower"></div>
        <div class="decor-waterfall decor-waterfall-sideways-lower"></div>
        <!-- train anims depends on it -->
        <div class="char-sheet" bind:this={charSheetElem}>
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
            --seg-height: 180vh;
            height: var(--seg-height);
            width: 100vw;
            position: relative;

            background-color: white;

            @media (max-width: 1023px) {
                height: max-content;
            }

            & .train-cont {
                margin-top: 20vh;
                position: relative;
                z-index: 20;

                & .train {
                    user-select: none;
                    width: 100%;
                    height: 20vh;

                    @media (max-width: 1023px) {
                        width: 175%;
                    }
                    @media (max-width: 767px) {
                        width: 400%;
                        height: 20vh;
                    }
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

                    @media (max-width: 1023px) {
                        height: 4vh;
                    }
                    @media (max-width: 767px) {
                        width: 250%;
                        height: 6vh;
                    }
                }
            }

            & .decor-waterfall {
                background-color: #212121;

                position: absolute;
                width: 44px;

                @media (max-width: 1023px) {
                    display: none;
                }
            }

            & .decor-waterfall-upper {
                top: 0;
                left: 40%;
                height: 40%;
            }

            /* way too snek */

            & .decor-waterfall-lower {
                top: 43%;
                left: 20%;
                height: 10%;

                clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 50% 87%, 0 100%);
            }

            & .decor-waterfall-sideways-lower {
                top: 40%;
                left: calc(-25% - 44px);
                width: 50%;
                height: 44px;
            }

            & .char-sheet {
                width: 100vw;
                box-sizing: border-box;
                padding: 6vw 3rem 0 3rem;

                display: flex;
                flex-direction: row;

                @media (max-width: 1023px) {
                    flex-direction: column;
                    gap: 2.5rem;
                    padding: 6vw 0 0 0;
                }

                & .infobloc {
                    width: 60%;
                    height: 69vh;

                    position: relative;
                    z-index: 10;

                    background-color: #ffffff;
                    border: 4px solid #1b1b1b;

                    @media (max-width: 1500px) {
                        height: max-content;
                    }
                    @media (max-width: 1023px) {
                        order: 1;
                        width: 100%;
                        height: max-content;
                        border: 0;
                    }

                    & .infobloc-inner {
                        width: 100%;
                        height: 100%;

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

                        @media (max-width: 1023px) {
                            width: 110%;
                            padding: 4rem 6rem;
                            --white-padding-size: 0;
                            position: relative;
                            left: 50%;
                            transform: translateX(-50%);
                        }
                        @media (max-width: 767px) {
                            padding: 2.5rem 3rem;
                        }

                        & p::selection {
                            color: black;
                            background-color: white;
                        }

                        & img::selection {
                            background-color: transparent;
                        }

                        & .infobloc-chief-blurb {
                            line-height: 1.8;
                        }

                        & .infobloc-blurbs {
                            margin-top: auto;
                            list-style: none;
                            display: grid;
                            grid-template-columns: 1fr 10% 1fr;
                            grid-template-rows: auto;

                            row-gap: 0.3rem;
                            line-height: 1.7rem;

                            @media (max-width: 1023px) {
                                margin-top: 2rem;
                                grid-auto-flow: dense;
                                grid-template-columns: auto;
                                row-gap: 0.8rem;

                                & li {
                                    height: min-content;
                                }
                            }

                            & .infobloc-separator {
                                user-select: none;
                                text-align: center;

                                @media (max-width: 1023px) {
                                    display: none;
                                }
                            }
                        }
                    }
                }

                & .pfpbloc-cont {
                    display: flex;
                    justify-content: center;
                    width: 40%;

                    @media (max-width: 1023px) {
                        order: 0;
                        width: 100%;
                        margin-top: 3rem;
                    }

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

                                @media (max-width: 1023px) {
                                    box-sizing: border-box;
                                    padding: 1rem 2rem 0 2rem;
                                }
                            }

                            & .status-info {
                                text-align: center;
                                padding-top: 1.5rem;
                                line-height: 1.6rem;
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