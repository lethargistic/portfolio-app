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
    <button class="floatie floatie-lang" aria-label="language changer"></button>
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
            box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px, rgb(51, 51, 51) 0px 0px 0px 3px;
        }

        & .floatie-maksiks {
            & h1 {
                mix-blend-mode: hard-light;
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

        }
    }
</style>