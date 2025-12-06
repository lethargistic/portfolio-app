<script lang="ts">
    import {m} from "../paraglide/messages.js"
    import {scale} from "svelte/transition"
    import {getLocale, setLocale} from "$lib/paraglide/runtime";
    import {Spring, Tween} from "svelte/motion";
    import {cubicOut} from "svelte/easing";
    import {currentLang} from "$lib/shared.svelte";

    let seeLang = $state(false);

    const languages = ["English", "日本語", "Українська"];
    let langButton: HTMLElement | null = $state(null);
    let langSelectors: HTMLElement | null = $state(null);

    const handleLangSettingsClose = (e: Event) => {
        const target = e.target;
        if (target == null) return;
        if (seeLang && !langButton?.contains(target as Node) && !langSelectors?.contains(target as Node)) {
            seeLang = false;
        }
    }

    const mapLang = {
        "English": "en",
        "日本語": "jp",
        "Українська": "uk",
    } as const;

    // TODO: maybe add fonts per lang (page load speed death?)
    const mapLangFontSize = {
        "en": null,
        "jp": "2rem",
        "uk": "2rem",
    } as const;

    const defaultFontSize = "2.5rem";

    let floatieIs: HTMLElement | null = $state(null);
    const handleChangeLang = (lang: String) => {
        seeLang = false;
        if (floatieIs == null) return;
        const langCode = mapLang[lang as keyof typeof mapLang];
        setLocale(langCode, {reload: false});
        currentLang.value = langCode;
        langFontSize = mapLangFontSize[getLocale()] ?? defaultFontSize;
    }

    let langFontSize: string | null = $state(mapLangFontSize[getLocale()] ?? defaultFontSize);

    //

    let scrollY = $state(0);
    let windowHeight = $state(0);
    let illuRotation = new Tween(0, {
        duration: 400,
        easing: cubicOut
    });

    const handleScroll = () => {
        illuRotation.target = scrollY / (windowHeight * 0.008);
    }

    //

    const floatieMaksiksCoords = new Spring({x: 0, y: 0}, {
        stiffness: 0.01,
        damping: 0.08
    });
    const floatieIsCoords = new Spring({x: 0, y: 0}, {
        stiffness: 0.01,
        damping: 0.1
    });
    let caught = $state(false);
    const hold = (coords: Spring<{ x: number; y: number }>) => {
        caught = true;
        coords.target = coords.current;
    }
    const runAway = (coords: Spring<{ x: number; y: number }>, mult: number, base: number) => {
        if (caught) return;
        coords.target = {
            x: (Math.floor(Math.random() * mult) + base) * (Math.random() < 0.5 ? -1 : 1),
            y: (Math.floor(Math.random() * mult) + base) * (Math.random() < 0.5 ? -1 : 1)
        };
    }
    const unHold = () => {
        caught = false;
    }
</script>

<svelte:window onscroll={handleScroll} bind:scrollY={scrollY} bind:innerHeight={windowHeight}
               onclick={handleLangSettingsClose}/>

<noscript>
    <p style="color: red">
        This site is quite heavy on javascript, you might not get the best experience!
    </p>
</noscript>
{#key currentLang.value}
    <div class="lang-settings">
        <button class="lang-button" onclick={() => {seeLang = !seeLang}} bind:this={langButton}>
            <img src="/img/icon/lucide_languages.svg" alt="language selector">
        </button>

        {#if seeLang}
            <div class="lang-selector-wrap" transition:scale>
                <ul class="lang-selectors" bind:this={langSelectors}>
                    {#each languages as lang}
                        <li>
                            <button onclick={() => handleChangeLang(lang)}>{lang}</button>
                        </li>
                    {/each}
                </ul>
            </div>
        {/if}
    </div>

    <section class="welcome-seg" id="welcome">
        <img style={`transform: translate(-50%, -50%) rotate(${illuRotation.current}deg)`}
             class="illu illu-left"
             src="/img/illu1.webp"
             alt="cool illusion part 1">
        <img style={`transform: translate(-50%, -50%) rotate(${illuRotation.current*2}deg)`}
             class="illu illu-right"
             src="/img/illu2.webp"
             alt="cool illusion part 2">

        <!--TODO: maybe use grabbing cursor-->
        <div style={`transform: translate(${floatieMaksiksCoords.current.x}px, ${floatieMaksiksCoords.current.y}px)`}
             onmousemove={() => {runAway(floatieMaksiksCoords, 125, 25)}}
             class="floatie floatie-maksiks" onmousedown={() => {hold(floatieMaksiksCoords)}} onmouseup={unHold}
             onmouseout={unHold} onblur={unHold} tabindex="0" role="button"
             aria-label="header text that runs away">
            <h1>{m.welcome_button_maksiks()}</h1>
        </div>

        <!--TODO: maybe think up something better-->
        <div style={`
    transform: translate(${floatieIsCoords.current.x}px, ${floatieIsCoords.current.y}px);
    font-size: ${langFontSize} !important;
    `}
             onmousemove={() => {runAway(floatieIsCoords, 10, 0)}} onmousedown={() => {hold(floatieIsCoords)}}
             onmouseup={unHold}
             tabindex="0"
             class="floatie floatie-is" bind:this={floatieIs} role="button"
             aria-label="floatie is">
            <h2>{m.welcome_button_is()}</h2>
        </div>
    </section>

    <style>
        .lang-settings {
            position: absolute;
            top: 2rem;
            right: 2rem;

            & button {
                all: unset;
                cursor: pointer;
            }

            --icon-width: 1.6rem;

            & .lang-button {
                position: absolute;
                top: 0.3rem;
                right: 0;

                user-select: none;

                & img {
                    width: var(--icon-width);
                }
            }

            & .lang-selectors {
                margin-right: calc(var(--icon-width) + 1vw);
                position: relative;
                list-style: none;
                color: white;

                user-select: none;

                display: flex;
                flex-direction: column;

                background-color: #232323;
                border: #888888 1px solid;
                border-radius: 1px;

                & li {
                    width: 16vw;
                    height: 1.6vw;

                    display: flex;
                    align-items: center;

                    padding: 0.6rem 0 0.6rem 0;
                    font-size: 1.1rem;

                    & button {
                        padding: 0.6rem 0 0.6rem 0.8rem;
                        width: 100%;
                        height: 100%;
                    }
                }

                & button:hover, & button:focus {
                    background: #454545;
                }
            }
        }

        .welcome-seg {
            /* ref in code above ! */
            --floatie-font-size: 4.5rem;

            width: 100vw;
            height: 105vh;
            background-color: #232323;

            display: flex;
            justify-content: center;
            align-items: center;
            /* super duper precise positioning ! */

            & .illu {
                zoom: 1.025;
                height: 30.425vw;

                /* youtrack says they fixed it hmm, unreleased yet maybe? */
                /* noinspection CssInvalidFunction */
                --spring-easing: linear(0, 0.0018, 0.0069 1.15%, 0.026 2.3%, 0.0637, 0.1135 5.18%, 0.2229 7.78%, 0.5977 15.84%, 0.7014, 0.7904, 0.8641, 0.9228, 0.9676 28.8%, 1.0032 31.68%, 1.0225, 1.0352 36.29%, 1.0431 38.88%, 1.046 42.05%, 1.0448 44.35%, 1.0407 47.23%, 1.0118 61.63%, 1.0025 69.41%, 0.9981 80.35%, 0.9992 99.94%);
                --spring-duration: 0.8333s;

                transition: var(--spring-duration) var(--sping-easing);

                user-select: none;
                pointer-events: none;
                position: absolute;

                /* centered inline because transform order */
            }

            & .illu-left {
                width: 28.8vw;
                left: 50.4%;
                top: 55.2%;
            }

            & .illu-right {
                width: 28.825vw;
                left: 54.7%;
                top: 49.3%;
                box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
            }

            & .floatie {
                cursor: initial;

                background-color: #bd00da; /* math */
                mix-blend-mode: hard-light;
                box-shadow: rgba(0, 0, 0, 0.16) 0 1px 4px, rgb(51, 51, 51) 0 0 0 3px;
            }

            & .floatie-maksiks {
                position: absolute;

                left: 13%;

                & h1 {
                    pointer-events: none;
                    user-select: none;

                    padding: 0.1vw 1vw;
                    color: white;
                    z-index: 2;

                    font-size: var(--floatie-font-size);

                    font-family: "Karla", sans-serif;
                    font-optical-sizing: auto;
                    font-weight: Bold;
                    font-style: normal;

                    box-shadow: rgba(0, 0, 0, 0.25) 0 14px 35px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
                }

            }

            --right-floatie-hz-shift: 67%;
            --right-floatie-vr-margin: 4rem;

            & .floatie-is {
                left: calc(var(--right-floatie-hz-shift) + 3.8vw);
                margin-top: var(--right-floatie-vr-margin);

                position: absolute;
                display: flex;
                align-items: center;
                box-sizing: border-box;
                color: white;

                & h2 {
                    pointer-events: none;
                    user-select: none;

                    padding: 0.1vw 1vw;
                    color: white;
                    z-index: 2;

                    font-family: "Karla", sans-serif;
                    font-optical-sizing: auto;
                    font-weight: Bold;
                    font-style: normal;

                    box-shadow: rgba(0, 0, 0, 0.25) 0 14px 35px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
                }
            }
        }
    </style>
{/key}
