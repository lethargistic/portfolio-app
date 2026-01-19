<script lang="ts">
    import {Spring} from "svelte/motion";

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
            x: -(pointerY - card.offsetTop - cardHeight / 2) / 12,
            y: (pointerX - card.offsetLeft - cardWidth / 2) / 5
        };
        scale.target = 1.05;
    }
    const handlePointerLeave = () => {
        act = false;
        scale.target = 1;
        rotation.target = {x: 0, y: 0};
    }
</script>

<div class="card"
     style={`transform: perspective(600px) rotateX(${rotation.current.x}deg) rotateY(${rotation.current.y}deg) scale(${scale.current})`}
     onpointermove={handlePointerMove} onpointerout={handlePointerLeave}
     bind:clientWidth={cardWidth}
     bind:clientHeight={cardHeight}
     bind:this={card}
>
    {act ? 'bread' : 'e'}
</div>

<style>
    .card {
        position: absolute;
        right: 10vw;
        top: 20vh;

        width: 15vw;
        height: 30vw;

        background-color: #f89e9e;

        z-index: 2;
    }
</style>