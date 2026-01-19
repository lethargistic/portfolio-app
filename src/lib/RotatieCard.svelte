<script lang="ts">
    import {Spring} from "svelte/motion";

    let {proj} = $props();

    let card: HTMLElement | null = $state(null);
    let cardWidth = $state(0);
    let cardHeight = $state(0);
    let act = $state(false);
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
</script>

<a class="card" href={proj.link}
     style={`transform: perspective(600px) rotateX(${rotation.current.x}deg) rotateY(${rotation.current.y}deg) scale(${scale.current});
             left: ${proj.left_vw}vw; top: ${proj.top_vh}vh; width: ${proj.width_vw}vw;`}
     onpointermove={handlePointerMove} onpointerout={handlePointerLeave}
     bind:clientWidth={cardWidth}
     bind:clientHeight={cardHeight}
     bind:this={card}>
    {act ? 'bread' : 'e'}
</a>

<style>
    .card {
        position: absolute;
        display: flex;

        aspect-ratio: 16/9;

        background-color: #6728b3;

        z-index: 2;
    }
</style>