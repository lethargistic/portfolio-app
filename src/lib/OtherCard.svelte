<script>
    let {other} = $props();
</script>

<div class="other-card">
    <img class="frame" src="/img/other-frame.webp" alt="a frame">
    <h3 class="display">{other.display_name}</h3>
    <div class="img-wrap">
        <img src={other.img} alt={other.display_name}>
    </div>
</div>

<style>
    .other-card {
        width: 30vw;
        height: 30vw;
        position: absolute;
        left: 30vw;
        top: 30vw;

        & .display {
            position: absolute;
            left: -5%;
            top: 25%;

            background-color: rgba(0, 0, 0, 0.59);

            font-family: Tiny5, sans-serif;
            font-weight: normal;
            font-size: 3rem;
            letter-spacing: 0.6rem;
            text-shadow: 0 1px 0 #ccc,
            0 2px 0 #c9c9c9,
            0 3px 0 #bbb,
            0 4px 0 #b9b9b9,
            0 5px 0 #aaa,
            0 6px 1px rgba(0, 0, 0, .1),
            0 0 5px rgba(0, 0, 0, .1),
            0 1px 3px rgba(0, 0, 0, .3),
            0 3px 5px rgba(0, 0, 0, .2),
            0 5px 10px rgba(0, 0, 0, .25),
            0 10px 10px rgba(0, 0, 0, .2),
            0 20px 20px rgba(0, 0, 0, .15);
        }

        & .img-wrap {
            & img {
                user-select: none;
                user-drag: none;
                -webkit-user-drag: none;
                width: 100%;
            }
        }

        & .frame {
            image-rendering: pixelated;
            width: 130%;
            position: absolute;
            transform: translate(-50%, -50%);
            left: 50%;
            top: 20%;
            filter: drop-shadow(0 1px 0 #ccc) drop-shadow(0 3.8px 0 #c9c9c9)

            user-select: none;
            user-drag: none;
            -webkit-user-drag: none;
        }
    }
</style>