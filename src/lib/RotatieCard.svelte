<script lang="ts">
    import {Spring} from "svelte/motion";

    let {proj} = $props();

    let act = $state(false)
    let card: HTMLElement | null = $state(null);
    let cardWidth = $state(0);
    let cardHeight = $state(0);
    let rotation = new Spring({x: 0, y: 0}, {
        stiffness: 0.01,
        damping: 0.08
    });
    let scale = new Spring(1);

    const handlePointerMove = (e: PointerEvent) => {
        if (!card) return;

        act = true;
        const pointerX = e.clientX;
        const pointerY = e.clientY;

        rotation.target = {
            x: (pointerY - card.offsetTop - cardHeight / 2) / 8,
            y: -(pointerX - card.offsetLeft - cardWidth / 2) / 12
        };
        scale.target = 1.05;
    }
    const handlePointerLeave = () => {
        act = false;
        scale.target = 1;
        rotation.target = {x: 0, y: 0};
    }

    // the shadow remains flat when rotated so we basically have to remove it
    // TODO maybe: make pseudo shadow that only rotates on y
    const inactiveShadow = "rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px";
    const activeShadow = "rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;";
</script>

<a class="card" href={proj.link}
   style={`transform: perspective(600px) rotateX(${rotation.current.x}deg) rotateY(${rotation.current.y}deg) scale(${scale.current});
             left: ${proj.left_vw}vw; top: ${proj.top_vh}vh; width: ${proj.width_vw}vw;`}
   onpointermove={handlePointerMove} onpointerout={handlePointerLeave}
   bind:clientWidth={cardWidth}
   bind:clientHeight={cardHeight}
   bind:this={card}>
    <div class="card-info">
        <h3>{proj.display_name}</h3>
    </div>
    <div class="img-wrap">
        <img style={`box-shadow: ${act ? activeShadow : inactiveShadow};`} src={proj.img} alt={proj.name}/>
    </div>
</a>

<style>
    .card {
        position: absolute;
        z-index: 2;
        display: grid;

        .card-info {
            & h3 {
                font-family: 'Fira Mono', monospace;
                font-weight: normal;
            }
        }

        & .img-wrap {
            position: relative;
            & img {
                width: 100%;
                aspect-ratio: 16/9;

                transition: box-shadow 0.5s;
            }

            &:before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(to right, #111111, transparent);
                pointer-events: none;
            }
        }
    }
</style>