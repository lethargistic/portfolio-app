<script>
</script>

<section class="welcome-seg" id="welcome">
    <img class="illu illu-left" src="/img/illu1.webp" alt="cool illusion part 1">
    <img class="illu illu-right" src="/img/illu2.webp" alt="cool illusion part 2">

    <button class="floatie floatie-maksiks"></button>
    <button class="floatie floatie-lang"></button>
</section>

<style>
    .welcome-seg {
        width: 100vw;
        height: 100vh;
        background-color: #232323;


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
    }
</style>