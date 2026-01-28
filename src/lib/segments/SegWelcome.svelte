<script lang="ts">
    import {getLocale, setLocale} from "$lib/paraglide/runtime";
    import {Spring, Tween} from "svelte/motion";
    import {cubicOut, cubicInOut, cubicIn} from "svelte/easing";
    import {currentLang, deviceMin, fiend, settings, t} from "$lib/shared.svelte";
    import {scale} from "svelte/transition"

    let seeLang = $state(false);
    let seeSettings = $state(false);

    const languages = ["English (original)", "日本語", "Українська"];
    let langButton: HTMLElement | null = $state(null);
    let settingsButton: HTMLElement | null = $state(null);
    let langSelectors: HTMLElement | null = $state(null);
    let settingsSelectors: HTMLElement | null = $state(null);

    const handleSettingsClose = (e: Event) => {
        const target = e.target;
        if (target == null) return;
        if (seeLang && !langButton?.contains(target as Node) && !langSelectors?.contains(target as Node)) {
            seeLang = false;
        }
        if (seeSettings && !settingsButton?.contains(target as Node) && !settingsSelectors?.contains(target as Node)) {
            seeSettings = false;
        }
    }

    const flipSettings = () => {
        if (seeLang) seeLang = false;
        seeSettings = !seeSettings;
    }
    const flipLang = () => {
        if (seeSettings) seeSettings = false;
        seeLang = !seeLang;
    }

    const mapLang = {
        "English (original)": "en",
        "日本語": "jp",
        "Українська": "uk",
    } as const;

    // TODO: maybe add fonts per lang (page load speed death?)
    const mapLangFontSize = {
        "en": deviceMin.tablet ? "2.5rem" : null,
        "jp": deviceMin.tablet ? "2rem" : "2rem",
        "uk": deviceMin.tablet ? "1.8rem" : "2rem",
    } as const;

    const defaultFontSize = "2.5rem";

    let floatieIs: HTMLElement | null = $state(null);
    const handleChangeLang = (lang: String) => {
        seeLang = false;
        if (floatieIs == null) return;
        const langCode = mapLang[lang as keyof typeof mapLang];
        setLocale(langCode, {reload: false});
        currentLang.lang = langCode;
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
               onclick={handleSettingsClose}/>

<noscript>
    <p style="color: red">
        This site is quite heavy on javascript, you might not get the best experience!
        Most of my user-centered sides are no-js compatible though of course :)
    </p>
</noscript>
{#key currentLang.lang}
    <div class="settings-cont">
        <div class="main-settings opener-settings">
            <button class="settings-button opener-button" onclick={flipSettings} bind:this={settingsButton}>
                <img class="settings-icon" src="/img/icons/lucide-settings.svg" alt="settings">
            </button>
        </div>
        <div class="lang-settings opener-settings">
            <button class="lang-button opener-button" onclick={flipLang} bind:this={langButton}>
                <img class="lang-icon" src="/img/icons/lucide-languages.svg" alt="language selector">
            </button>
        </div>
        {#if seeLang || seeSettings}
            <div class="opener-selector-wrap" transition:scale={{easing: cubicInOut}}>
                {#if seeSettings}
                    <ul class="settings-selectors opener-selectors" bind:this={settingsSelectors}>
                        {#each Object.entries(settings) as [key, value] (key + '_salt932')}
                            {#if !value.admin || (value.admin && fiend.state)}
                                <li>
                                    <label for={key}>
                                        <!-- seo unimportant here, so whatever -->
                                        <div class="checkbox-cont">
                                            <input id={key} name={key} type="checkbox"
                                                   bind:checked={settings[key].state}/>
                                        </div>
                                        <p>{t[value.display]()}</p>
                                        {#if key === 'extendedLinktree' && deviceMin.mobile}
                                            <p class="note">Note: may lag on mobile</p>
                                        {/if}
                                        <small>{@html t[value.desc]()}</small>
                                    </label>
                                </li>
                            {/if}
                        {/each}
                    </ul>
                {/if}
                {#if seeLang}
                    <ul class="lang-selectors opener-selectors" bind:this={langSelectors}>
                        {#each languages as lang}
                            <li>
                                <button onclick={() => handleChangeLang(lang)}>{lang}</button>
                            </li>
                        {/each}
                    </ul>
                {/if}
            </div>
        {/if}
    </div>

    <section class='welcome-seg' id="welcome">
        {#if settings.no_flashing.state}
            <img transition:scale={{duration: 800, easing: settings.no_flashing.state ? cubicIn : cubicOut}}
                 class="no-flashing"
                 src="/img/illu-no-illu.svg"
                 alt="a moon with a forest on it">
        {:else}
            <img transition:scale={{duration: 1200, easing: settings.no_flashing.state ? cubicOut : cubicIn}}
                 style={`transform: translate(-50%, -50%) rotate(${illuRotation.current}deg)`}
                 class="illu illu-left"
                 src='/img/illu1.webp'
                 alt="cool illusion part 1">
            <img transition:scale={{duration: 1200, easing: settings.no_flashing.state ? cubicOut : cubicIn}}
                 style={`transform: translate(-50%, -50%) rotate(${illuRotation.current*2}deg)`}
                 class="illu illu-right"
                 src='/img/illu2.webp'
                 alt="cool illusion part 2">
        {/if}

        <!--TODO: maybe use grabbing cursor-->
        <div style={`transform: translate(${floatieMaksiksCoords.current.x}px, ${floatieMaksiksCoords.current.y}px)`}
             onmousemove={() => {runAway(floatieMaksiksCoords, 125, 25)}}
             class="floatie floatie-maksiks" onmousedown={() => {hold(floatieMaksiksCoords)}} onmouseup={unHold}
             onmouseout={unHold} onblur={unHold} tabindex="0" role="button"
             aria-label="header text that runs away">
            <h1>{t.welcome_button_maksiks()}</h1>
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
            <h2>{t.welcome_button_is()}</h2>
        </div>
    </section>

    <style>
        .settings-cont {
            position: absolute;

            --lang-icon-width: 1.6rem;
            --settings-icon-width: calc(var(--lang-icon-width) - 0.1rem);
            --openers-top: 2rem;
            --openers-right: 2rem;
            right: var(--openers-right);
            top: var(--openers-top);

            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            gap: 2rem;

            @media (max-width: 767px) {
                --openers-right: 1.5rem;
            }

            & button {
                all: unset;
                cursor: pointer;
            }

            & .opener-settings {
                display: flex;
                flex-direction: column;

                & .opener-button {
                    user-select: none;
                    margin-left: auto;

                    & .settings-icon {
                        width: var(--settings-icon-width)
                    }

                    & .lang-icon {
                        width: var(--lang-icon-width);
                    }
                }
            }

            & .opener-selector-wrap {
                position: absolute;
                z-index: 999;

                top: 0;
                right: var(--openers-right);

                --mobile-selector-width: 75vw;

                & .opener-selectors {
                    margin-right: calc(var(--lang-icon-width) + 1vw);
                    list-style: none;
                    color: white;

                    user-select: none;

                    display: flex;
                    flex-direction: column;

                    background-color: #232323;
                    border: #888888 1px solid;
                    border-radius: 1px;

                    & li, li > label {
                        width: 16vw;
                        min-height: 1.6vw;

                        display: flex;
                        align-items: center;

                        font-size: 1.1rem;
                    }

                    & li {
                        .note {
                            margin: 0.2rem 0 0 0;
                            grid-column: span 2;
                            font-size: 0.8rem;
                            width: 100%;
                        }
                    }
                }

                & .settings-selectors {
                    position: relative;
                    width: 28vw;
                    gap: 0.3rem;
                    padding: 0.6rem 0;

                    @media (max-width: 767px) {
                        width: var(--mobile-selector-width);
                    }

                    & li {
                        width: 100%;
                    }

                    & li > label {
                        display: grid;
                        grid-template-columns: 1rem auto;
                        grid-template-rows: auto auto;

                        cursor: pointer;

                        gap: 0.5rem;

                        width: 100%;
                        padding: 0.6rem 0.6rem 0.6rem 1.2rem;
                        box-sizing: border-box;

                        & .checkbox-cont {
                            display: flex;
                            align-items: center;

                            width: 1rem;

                            & input {
                                -webkit-appearance: none;
                                appearance: none;
                                background-color: #fff;
                                margin: 0;

                                width: 1rem;
                                height: 1rem;
                                border-radius: 1px;
                                border: 2px solid black;

                                display: grid;
                                place-content: center;

                                &::before {
                                    content: "";
                                    width: 0.6rem;
                                    height: 0.6rem;
                                    transform: scale(0);
                                    transition: transform 0.12s ease-in-out;
                                    background-color: #a712dc;
                                    transform-origin: bottom left;


                                    clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
                                }

                                &:checked::before {
                                    transform: scale(1);
                                }
                            }
                        }

                        & small {
                            grid-column: span 2;
                            line-height: 1.6rem;
                            color: #bfbfbf;
                        }
                    }
                }

                & .lang-selectors {
                    @media (max-width: 767px) {
                        width: var(--mobile-selector-width);
                    }

                    & li {
                        height: 1.6vw;
                        padding: 0.6rem 0 0.6rem 0;

                        @media (max-width: 767px) {
                            width: 100%;
                            min-height: 7vw;
                        }
                    }

                    & button {
                        padding: 0.6rem 0 0.6rem 0.8rem;
                        width: 100%;
                        height: 100%;
                    }

                    & button:hover, & button:focus {
                        background: #454545;
                    }
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

            @media (max-width: 767px) {
                --floatie-font-size: 4rem;
            }

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

                @media (max-width: 767px) {
                    height: 86vw;

                    /* transform rotation makes it go off screen if it's absolute */
                    /* so im just making it artsier instead */
                    position: relative;
                }
            }

            & .illu-left {
                width: 28.8vw;
                left: 50.4%;
                top: 55.2%;

                @media (max-width: 767px) {
                    left: 58%;
                    top: 35.2%;
                    width: 84.6vw;
                }
            }

            & .illu-right {
                width: 28.825vw;
                left: 54.7%;
                top: 49.3%;

                box-shadow: rgba(0, 0, 0, 0.25) 0 54px 55px, rgba(0, 0, 0, 0.12) 0 -12px 30px, rgba(0, 0, 0, 0.12) 0 4px 6px, rgba(0, 0, 0, 0.17) 0 12px 13px, rgba(0, 0, 0, 0.09) 0 -3px 5px;

                @media (max-width: 767px) {
                    left: 43%;
                    top: 40.2%;
                    width: 84.625vw;
                }
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

                @media (max-width: 767px) {
                    margin-top: -70vh;
                    left: 5%;
                }

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

                    box-shadow: rgba(0, 0, 0, 0.25) 0 14px 35px, rgba(0, 0, 0, 0.12) 0 -12px 30px, rgba(0, 0, 0, 0.12) 0 4px 6px, rgba(0, 0, 0, 0.17) 0 12px 13px, rgba(0, 0, 0, 0.09) 0 -3px 5px;
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

                @media (max-width: 767px) {
                    margin-top: -40vh;
                    left: 5%;
                }

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

                    box-shadow: rgba(0, 0, 0, 0.25) 0 14px 35px, rgba(0, 0, 0, 0.12) 0 -12px 30px, rgba(0, 0, 0, 0.12) 0 4px 6px, rgba(0, 0, 0, 0.17) 0 12px 13px, rgba(0, 0, 0, 0.09) 0 -3px 5px;
                }
            }
        }

        & .no-flashing {
            box-shadow: none;
            margin-left: 24rem;
            width: 37vw;
            height: 37.5vw;
            aspect-ratio: 1/1;
            pointer-events: none;
            -webkit-user-drag: none;
            user-select: none;
        }
    </style>
{/key}
