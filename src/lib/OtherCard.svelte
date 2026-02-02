<script>
    let {other} = $props();
</script>

<div style={`
width: ${other.width_vw}vw;
right: ${other.right_vw}vw;
top: ${other.top_vh}vh;
`} class="other-card">
    <img class="frame" src="/img/other-frame.webp" alt="a frame">
    <h3 class="display">{other.display_name}</h3>
    <div class="img-wrap">
        <img src={other.img} alt={other.display_name}>
    </div>
</div>

<style>
    .other-card {
        width: 24vw;
        height: 30vw;
        position: absolute;
        top: 30vw;

        & .display {
            position: absolute;
            z-index: 3;
            left: -26%;
            top: 8%;

            padding: 0 0.2rem 0 1rem;

            background-color: rgba(0, 0, 0, 0.59);

            font-family: Tiny5, sans-serif;
            font-weight: normal;
            font-size: 2rem;
            letter-spacing: 0.6rem;
        }

        & .img-wrap {
            cursor: pointer;

            & img {
                user-select: none;
                user-drag: none;
                -webkit-user-drag: none;
                width: 100%;

                position: relative;
                transform: translate(-50%, -50%);
                left: 50%;
                top: 50%;

                transition: filter 0.25s ease;
                filter: grayscale(50%);

                &:hover {
                    filter: grayscale(0)
                }
            }
        }

        & .frame {
            image-rendering: pixelated;
            width: 125%;
            position: absolute;
            transform: translate(-50%, -50%);
            z-index: 2;
            pointer-events: none;
            left: 50%;
            top: -0.5%;
            filter: drop-shadow(0 1px 0 #ccc) drop-shadow(0 3.8px 0 #c9c9c9);

            user-select: none;
            user-drag: none;
            -webkit-user-drag: none;

        }
    }
</style>