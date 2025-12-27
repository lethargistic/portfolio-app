<script lang="ts">
    import {onMount} from "svelte";
    import * as three from "three";

    let canvas: HTMLCanvasElement | null = $state(null);

    const fov = 75;
    const aspect = 2;
    const near = 0.1;
    const far = 5;

    let rope: three.Mesh | null = $state(null);
    let chime: three.Mesh | null = $state(null);
    let renderer: three.WebGLRenderer | null = $state(null);
    let scene: three.Scene | null = $state(null);
    let camera: three.Camera | null = $state(null);

    onMount(() => {
        if (canvas == null) return;
        renderer = new three.WebGLRenderer({antialias: true, canvas});
        camera = new three.PerspectiveCamera(fov, aspect, near, far);
        camera.position.z = 2;

        scene = new three.Scene();


        renderer.render(scene, camera);
    })
</script>
<canvas bind:this={canvas} id="chime-tst"></canvas>

<style>
    #chime-tst {
        position: relative;
        top: 8rem;
    }
</style>
