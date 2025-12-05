<script>
    import {m} from "../paraglide/messages.js"

    // TODO: animate

    const languages = ["English", "日本語", "Українська"];
</script>

<div class="lang-settings">
    <button class="lang-button">
        <img src="/img/icon/lucide_languages.svg" alt="language selector">
    </button>

    <div class="ui-trig ui-trig-outer"></div>
    <div class="ui-trig ui-trig-inner"></div>
    <ul class="lang-selector">
        {#each languages as lang}
            <li><button>{lang}</button></li>
        {/each}
    </ul>
</div>
<section class="welcome-seg" id="welcome">
    <img class="illu illu-left" src="/img/illu1.webp" alt="cool illusion part 1">
    <img class="illu illu-right" src="/img/illu2.webp" alt="cool illusion part 2">

    <div class="floatie floatie-maksiks" role="button" aria-label="header text that runs away">
        <h1>{m.welcome_button_maksiks()}</h1>
    </div>

    <!--TODO: think up something better-->
    <div class="floatie floatie-second" role="button" aria-label="floatie 2">
        <h2>is a dev</h2>
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
            top: 0;
            right: 0;

            & img {
                width: var(--icon-width);
            }
        }

        & .ui-trig {
            position: absolute;
            top: 0.8rem;
            right: calc(var(--icon-width) + 0.2rem);
            transform: rotate(90deg);

            clip-path: polygon(50% 0%, 0% 100%, 100% 100%)
        }

        & .ui-trig-outer {
            right: calc(var(--icon-width) + 0.05rem);
            margin-top: -0.6px;
            width: 30px;
            height: 16px;
            background: #888888;
        }
        & .ui-trig-inner {
            width: 26px;
            height: 14px;
            background: #232323;
        }

        & .lang-selector {
            margin-right: calc(var(--icon-width) + 1vw);
            position: relative;
            list-style: none;
            color: white;

            display: flex;
            flex-direction: column;
            gap: 1rem;

            background-color: #232323;
            border: #888888 1px solid;
            padding: 0.9rem 8rem 0.9rem 0.8rem;
            border-radius: 1px;

            & li {
                padding: 0.1rem 0.2rem;
                font-size: 1.1rem;
            }
        }
    }

    .welcome-seg {
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

        & .floatie-second {
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
                font-size: calc(var(--floatie-font-size) - 0.5rem);

                font-family: "Karla", sans-serif;
                font-optical-sizing: auto;
                font-weight: Bold;
                font-style: normal;

                box-shadow: rgba(0, 0, 0, 0.25) 0 14px 35px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;

            }
        }
    }
</style>