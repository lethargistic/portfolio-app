<script lang="ts">
    import {currentLang} from "$lib/shared.svelte";
    import {Tween} from "svelte/motion";

    import * as three from "three";
    import {onMount} from "svelte";
    import {cubicOut} from "svelte/easing";
    import Chime from "$lib/hangies/Chime.svelte";
    import {SeparatorShape} from "$lib/utils";

    const socials = [
        {
            name: "github", link: "https://github.com/maksiksq",
            folds: [
                {
                    title: "github",
                    left: true,
                    icon: "#",
                    link: null,
                    state: "greg"
                },
                {
                    title: "stars",
                    left: false,
                    icon: "#",
                    link: null,
                    state: "greg"
                },
                {
                    title: "commits",
                    left: false,
                    icon: "#",
                    link: null,
                    state: "greg"
                },
                {
                    title: "followers",
                    left: false,
                    icon: "#",
                    link: null,
                    state: "greg"
                }
            ]
        },
        //     {name: "chaos-abyss", link: "https://www.chaos-abyss.com/"},
        //     {name: "bluesky", link: "https://bsky.app/profile/maksiks.bsky.social"},
        //     {name: "linkedin", link: "https://www.linkedin.com/in/maksiksq/"},
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
    <section class="linktree-seg" id="skills">
        <img class="lilac-cherry-branch" src="/img/branch2transparent.webp"
             alt="a sakura branch except flowers are lilac for some reason">
        <div class=chime-cont>
            {#each socials as social}
                <div class="social-chime">
                    <Chime {social} folds={social.folds} foldCount={4} chimeYOffset={0.3} chimeHeight="110vh"
                           separatorShape={SeparatorShape.Rectangle}></Chime>
                </div>
            {/each}
        </div>
    </section>

    <style>
        .linktree-seg {
            height: 160vh;
            width: 100vw;
            position: relative;

            display: flex;
            flex-direction: column;

            background-color: white;
            background-image: url("/img/train_front.webp");
            background-repeat: repeat;

            & .lilac-cherry-branch {
                width: 90vw;
                align-self: flex-end;
                user-select: none;
            }

            & .chime-cont {
                position: absolute;

                display: flex;
                gap: 0.5rem;

                & .social-chime {
                    position: absolute;
                    transform: translate(-37%, 0);
                    left: 37vw;
                    top: 65vh;
                }
            }
        }
    </style>
{/key}