<script lang="ts">
    import {currentLang} from "$lib/shared.svelte";
    import {Tween} from "svelte/motion";

    import * as three from "three";
    import {onMount} from "svelte";
    import {cubicOut} from "svelte/easing";
    import ChimeTest from "$lib/segments/ChimeTest.svelte";

    const socials = [
        {name: "github", link: "https://github.com/maksiksq"},
        {name: "chaos-abyss", link: "https://www.chaos-abyss.com/"},
        {name: "bluesky", link: "https://bsky.app/profile/maksiks.bsky.social"},
        {name: "linkedin", link: "https://www.linkedin.com/in/maksiksq/"},
    ]

    //

    let canvas: HTMLCanvasElement | null = $state(null);

    const fov = 75;
    const aspect = 2;
    const near = 0.1;
    const far = 5;

    const cubeRotationSettings = {
        duration: 2000,
        easing: cubicOut,
    };

    let cubeRotation = $state(new Tween(0, cubeRotationSettings));

    let cube: three.Mesh | null = $state(null);
    let renderer: three.WebGLRenderer | null = $state(null);
    let scene: three.Scene | null = $state(null);
    let camera: three.Camera | null = $state(null);

    $effect(() => {
        if (!cube || !renderer || !scene || !camera) return;
        cube.rotation.x = cubeRotation.current;
        cube.rotation.y = cubeRotation.current;
        renderer.render(scene, camera)
        if (cubeRotation.current >= Math.PI * 2) {
            cubeRotation = new Tween(-(Math.PI * 2), cubeRotationSettings);
            cubeRotation.target = Math.PI * 2;
        }
    })

    onMount(() => {
        if (canvas == null) return;
        renderer = new three.WebGLRenderer({antialias: true, canvas});
        camera = new three.PerspectiveCamera(fov, aspect, near, far);
        camera.position.z = 2;

        scene = new three.Scene();

        const boxWidth = 1;
        const boxHeight = 1;
        const boxDepth = 1;
        const boxGeometry = new three.BoxGeometry(boxWidth, boxHeight, boxDepth);
        const boxMaterial = new three.MeshBasicMaterial({color: 0xffffff});

        cube = new three.Mesh(boxGeometry, boxMaterial);

        scene.add(cube);

        renderer.render(scene, camera);

        cubeRotation.target = Math.PI * 2;
    })
</script>


{#key currentLang.lang}
    <section class="skills-seg" id="skills">
        greg
        <img class="lilac-cherry-branch" src="/img/branch2transparent.webp"
             alt="a sakura branch except flowers are lilac for some reason">
        <div class=chime-cont>
            {#each socials as social}
                <div class={`chime chime-${social.name}`}>
                    <div class="chime-noodle chime-noodle-upper"></div>
                    <div class="chime-stick"></div>
                    <div class="chime-noodle chime-noodle-lower"></div>
                    <div class="chime-hangie">
                        {social.name}
                    </div>
                </div>
            {/each}
        </div>
    </section>
    <canvas bind:this={canvas} id="tst"></canvas>

    <ChimeTest></ChimeTest>
    <style>
        #tst {
            position: relative;
            top: 3rem;
        }

        .skills-seg {
            height: 160vh;
            width: 100vw;
            position: relative;

            display: flex;
            flex-direction: column;

            background-color: white;

            & .lilac-cherry-branch {
                width: 90vw;
                align-self: flex-end;
            }

            & .chime-cont {
                display: flex;
                gap: 0.5rem;

                & .chime {
                    display: flex;
                    flex-direction: column;
                    align-items: center;

                    color: white;

                    & .chime-noodle {
                        width: 3px;
                        height: 32px;
                        background-color: #212121;
                    }

                    & .chime-stick {
                        width: 16px;
                        height: 256px;

                        background-color: #212121;
                    }

                    & .chime-noodle-lower {
                        height: 48px;
                        background-color: #212121;
                    }

                    & .chime-hangie {
                        width: 124px;
                        height: 124px;
                        background: #212121;
                        clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);

                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }

                }
            }
        }
    </style>
{/key}