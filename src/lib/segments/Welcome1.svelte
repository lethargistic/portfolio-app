<script>
    import {m} from "../paraglide/messages.js"

    // TODO: animate
</script>

<section class="welcome-seg" id="welcome">
    <img class="illu illu-left" src="/img/illu1.webp" alt="cool illusion part 1">
    <img class="illu illu-right" src="/img/illu2.webp" alt="cool illusion part 2">

    <p style="font-family: 'Comfortaa'">AA</p>

    <div class="floatie floatie-maksiks" role="button" aria-label="header text that runs away">
        <h1>{m.welcome_button_maksiks()}</h1>
    </div>
    <div class="floatie floatie-lang" role="button" aria-label="language changer">
        <img src="/img/icon/languages.svg" alt="language icon">
        <div class="floatie-separator"></div>
        <div class="floatie-selectors">
            <div class="floatie-floor-1-wrap">
                <p>English</p>
                <p class="jp">日本語</p>
            </div>
            <div class="floatie-floor-2-wrap">
                <p>Українська</p>
            </div>
        </div>
    </div>
</section>

<style>
    .welcome-seg {
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
            & h1 {
                pointer-events: none;
                user-select: none;

                padding: 0.1vw 1vw;
                color: white;
                z-index: 2;
                font-size: 4.5rem;

                font-family: "Karla", sans-serif;
                font-optical-sizing: auto;
                font-weight: Bold;
                font-style: normal;

                box-shadow: rgba(0, 0, 0, 0.25) 0 14px 35px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
            }

        }

        & .floatie-lang {
            display: flex;
            align-items: center;

            height: 10vh;
            box-sizing: border-box;
            padding: 0.5rem 0.8rem 0.5rem 0.8rem;

            color: white;

            & .floatie-separator {
                width: 4px;
                height: 93%;
                border-radius: 64px;

                margin: 0 0.8rem 0 0.8rem;

                background: white;
            }

            & img {
                height: 80%;
            }

            & .floatie-selectors {
                --floatie-font-size: 1.8rem;

                display: flex;
                flex-direction: column;

                font-size: var(--floatie-font-size);
                font-weight: bold;

                & .floatie-floor-1-wrap {
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;
                    gap: 4rem;

                    & .jp {
                        font-size: calc(var(--floatie-font-size) - 0.2rem);
                    }
                }
                & .floatie-floor-2-wrap {
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    & p {
                        margin-left: 3.3rem;
                    }
                }
            }
        }
    }
</style>