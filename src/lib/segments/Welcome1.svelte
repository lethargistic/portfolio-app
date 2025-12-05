<script lang="ts">
    import {m} from "../paraglide/messages.js"
    import {scale} from "svelte/transition"
    import {getLocale, setLocale} from "$lib/paraglide/runtime";

    let seeLang = $state(false);
    // TODO: animate

    const languages = ["English", "日本語", "Українська"];
    let langButton: HTMLElement | null = $state(null);
    let langSelectors: HTMLElement | null = $state(null);

    const handleLangSettingsClose = (e: Event) => {
            const target = e.target;
            if (target == null) return;
            if  (seeLang && !langButton?.contains(target as Node) && !langSelectors?.contains(target as Node)) {
                seeLang = false;
            }
    }

    const mapLang = {
        "English": "en",
        "日本語": "jp",
        "Українська": "uk",
    } as const;

    const mapLangFontSize = {
        "en": null,
        "jp": "2.5rem",
        "uk": "2rem",
    } as const;

    let floatieIs: HTMLElement | null = null;
    const handleChangeLang = (lang: String) => {
        seeLang = false;
        if (floatieIs == null) return;
        const langCode = mapLang[lang as keyof typeof mapLang];
        setLocale(langCode);
    }

    let langFontSize: string | null = $state(mapLangFontSize[getLocale()] ?? "4rem");
</script>

<svelte:window onclick={handleLangSettingsClose}/>

<noscript>
    <p style="color: red">
        This site is heavy on javascript, you might not get the best experience!
    </p>
</noscript>
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
    <img class="illu illu-left" src="/img/illu1.webp" alt="cool illusion part 1">
    <img class="illu illu-right" src="/img/illu2.webp" alt="cool illusion part 2">

    <div class="floatie floatie-maksiks" role="button" aria-label="header text that runs away">
        <h1>{m.welcome_button_maksiks()}</h1>
    </div>

    <!--TODO: think up something better-->
    <div class="floatie floatie-is" style={`font-size: ${langFontSize} !important;`} bind:this={floatieIs} role="button" aria-label="floatie is">
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
        height: 100vh;
        background-color: #232323;

        display: flex;
        justify-content: center;
        align-items: center;
        /* super duper precise positioning ! */

        & .illu {
            zoom: 1.025;
            height: 30.425vw;

            user-select: none;
            pointer-events: none;
            position: absolute;

            transform: translate(-50%, -50%);
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
            cursor: pointer;

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