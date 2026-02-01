<script lang="ts">
    import {currentLang, windowGlobals} from "$lib/shared.svelte";
    import {untrack} from "svelte";
    import {Spring} from "svelte/motion";

    const SNOWFLAKE_COUNT = 400;
    const SNOWFLAKE_SIZE_BASE = 30;
    const SNOWFLAKE_SIZE_MIN_ADDED = 3;

    const ROTATION_BASE_DEG = 45;
    const ROTATION_MIN_ADDED_DEG = 3;

    const BLUR_BASE = 5;

    const ANIMATION_SPEED_BASE_S = 23;
    const ANIMATION_MINIMUM_FALLING_SPEED_S = 11.5;

    const YURU_MAX_OFFSET = 10;

    let bodyElem: HTMLElement | null = $state(null);
    let snowyHeight: number = $state(0);

    $effect(() => {
        if (snowyHeight) {
            if (!bodyElem) return;
            bodyElem.style.setProperty('--snowy-height', `${snowyHeight}px`);
        }
    })

    const getAbsRand = (base: number, minAdded: number = 0) =>
        Math.abs(Math.floor(Math.random() * base - Math.random() * base)) + minAdded;

    let toUpdate = $state(0);
    const startFreshFlake = (ix: number, initial: boolean) => {
        const duration = getAbsRand(ANIMATION_SPEED_BASE_S, ANIMATION_MINIMUM_FALLING_SPEED_S);

        let timeout = null;
        if (windowGlobals.inner_width !== 0) {
            clearTimeout(snowflakes[ix].timeout);
            timeout = setTimeout(() => {
                snowflakes[ix].name = 'none';
                setTimeout(() => {
                    snowflakes[ix].name = 'snow-drop';
                }, 10)
                toUpdate = ix;

                // in hindsight this should've been made in js instead of css anims
            }, duration * 1000)
        }

        // TODO sometime: remake in js

        return {
            diagonal: getAbsRand(SNOWFLAKE_SIZE_BASE, SNOWFLAKE_SIZE_MIN_ADDED),
            // rotation: getAbsRand(ROTATION_BASE_DEG, ROTATION_MIN_ADDED_DEG),
            right: Math.abs(Math.floor(Math.random() * windowGlobals.inner_width * 1.3)),
            blur: getAbsRand(BLUR_BASE),
            name: initial ? 'snow-drop' : 'none',
            duration: duration,
            timeout: timeout,
            offset: Math.floor(Math.random() * YURU_MAX_OFFSET),
        }
    }

    const invalidateFlakes = () => Array.from({length: SNOWFLAKE_COUNT}, (_, i) => {
        return startFreshFlake(i, true)
    });
    let snowflakes: Array<Record<string, any>> = $state(invalidateFlakes());

    $effect(() => {
        if (toUpdate) {
            // reactivity
        }
        untrack(() => {
            snowflakes[toUpdate] = startFreshFlake(toUpdate, false);
        })
    })

    $effect(() => {
        // responsive
        if (windowGlobals.inner_width) {
            untrack(() => {
                document.documentElement.style.setProperty('--variable-name', 'new-value');
                snowflakes = invalidateFlakes();
            })
        }
    })

    //

    let mouseOffset = new Spring(0, {
        stiffness: 0.008,
        damping: 0.8
    });

    const yuru = (e: PointerEvent) => {
        mouseOffset.target = e.clientX / -4;
    }
</script>

<svelte:body bind:this={bodyElem}/>
{#key currentLang.lang}
    <section class="other-seg" id="other">
        <div class="pit"></div>
        <div class="snowy" onpointermove={yuru}>
            <div class="snow-cont" bind:clientHeight={snowyHeight}>
                {#each snowflakes as flake, i (i)}
                    {#key snowflakes[i]}
                        <div class="snowflake" style={`
                        width: ${flake.diagonal}px;
                        height: ${flake.diagonal}px;
                        --flake-right: ${flake.right+mouseOffset.current + flake.offset}px;
                        filter: blur(${flake.blur}px);
                        animation-name: ${flake.name};
                        animation-duration: ${flake.duration}s;
                    `}></div>
                    {/key}
                {/each}
            </div>
        </div>
    </section>

    <style>
        .snow-cont {
            width: 100%;
            height: 100%;
            position: relative;

            & .snowflake {
                /* js mostly */
                position: absolute;
                opacity: 0;
                top: 0;

                animation-name: snow-drop;
                animation-iteration-count: infinite;
                animation-direction: alternate;
                animation-timing-function: linear;
                animation-fill-mode: forwards;

                background-color: #ecebeb;
            }
        }

        .other-seg {
            --other-seg-height: 300vh;

            width: 100vw;
            height: var(--other-seg-height);
            position: relative;

            background-color: #171717;

            color: white;
            display: flex;

            & .pit {
                width: 7%;
                height: var(--other-seg-height);

                background-color: #191919;
                box-shadow: inset black 0 0 60px -12px;
            }

            & .snowy {
                width: 93%;
                --snowy-top-offset: -20vh;
                height: calc(var(--other-seg-height) - var(--snowy-top-offset));
                clip-path: polygon(0 0, 100% 0.8%, 100% 100%, 0% 100%);
                border-radius: 32px 0 0 0;

                margin-top: var(--snowy-top-offset);

                background-color: #141414;
                box-shadow: rgba(0, 0, 0, 0.3) 0 19px 38px, rgba(0, 0, 0, 0.22) 0 15px 12px;
            }
        }

        @keyframes snow-drop {
            0% {
                opacity: 0.0;
                right: calc(var(--flake-right) + 0px);
                transform: translate(0px, 0px);
            }

            5% {
                opacity: 0.5;
            }

            10% {
                right: calc(var(--flake-right) + 20px);
            }

            20% {
                right: calc(var(--flake-right) + 25px);
            }

            25% {
                opacity: 0.75;
                transform: translate(0px, calc(var(--snowy-height)*0.25));
            }

            30% {
                right: calc(var(--flake-right) + 20px);
            }

            40% {
                right: calc(var(--flake-right) + 0px);
            }

            50% {
                opacity: 1;
                right: calc(var(--flake-right) + -20px);
                transform: translate(0px, calc(var(--snowy-height)*0.5));
            }

            60% {
                right: calc(var(--flake-right) + -25px);
            }

            70% {
                right: calc(var(--flake-right) + -20px);
            }

            75% {
                opacity: 0.5;
                transform: translate(0px, calc(var(--snowy-height)*0.75));
            }

            80% {
                right: calc(var(--flake-right) + 0px);
            }

            100% {
                opacity: 0;
                transform: translate(0px, var(--snowy-height));
                right: calc(var(--flake-right) + 0px);
            }
        }
    </style>
{/key}