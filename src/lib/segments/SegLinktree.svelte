<script lang="ts">
    import {currentLang} from "$lib/shared.svelte";
    import {Tween} from "svelte/motion";

    import * as three from "three";
    import {onMount} from "svelte";
    import {cubicOut} from "svelte/easing";
    import Chime from "$lib/hangies/Chime.svelte";
    import {SeparatorShape} from "$lib/utils/utils";

    let { socials: socialProp } = $props();

    let socials: typeof socialProp = $state();

    // folds are resolved by title!
    // const socials = [
    //     {
    //         name: "github", link: "https://github.com/maksiksq",
    //         folds: [
    //             {
    //                 "title": "github",
    //                 "left": false,
    //                 "icon": "simple-icons-github.svg",
    //                 "link": null,
    //                 "state": "loading...",
    //                 "preface": null
    //             },
    //             {
    //                 "title": "commits",
    //                 "left": true,
    //                 "icon": "lucide-git-commit-horizontal.svg",
    //                 "link": null,
    //                 "state": "loading...",
    //                 "preface": null
    //             },
    //             {
    //                 "title": "followed",
    //                 "left": true,
    //                 "icon": "lucide-user.svg",
    //                 "link": null,
    //                 "state": "loading...",
    //                 "preface": "by "
    //             },
    //             {
    //                 "title": "repos",
    //                 "left": false,
    //                 "icon": "lucide-folder-git.svg",
    //                 "link": "https://github.com/maksiksq?tab=repositories",
    //                 "state": "loading...",
    //                 "preface": null
    //             },
    //             {
    //                 "title": "stars",
    //                 "left": false,
    //                 "icon": "lucide-star.svg",
    //                 "link": null,
    //                 "state": "loading...",
    //                 "preface": null
    //             },
    //         ]
    //     },
        //     {name: "chaos-abyss", link: "https://www.chaos-abyss.com/"},
        //     {name: "bluesky", link: "https://bsky.app/profile/maksiks.bsky.social"},
        //     {name: "linkedin", link: "https://www.linkedin.com/in/maksiksq/"},
    // ]

    const updateGithubSocial = async () => {
        console.log("socials", socials);
        socials = socialProp;
        const githubSocial = socials.find((s: typeof socials[number]) => s.name = "github");
        if (!githubSocial) return;

        let freshGithubFoldsRes = await fetch("/api/v1/socials/github");

        const oldSocials: typeof socialProp = socials;
        oldSocials[socials.findIndex((s: typeof socials[number]) => s.name = 'github')].folds
            = await freshGithubFoldsRes.json();

        socials = oldSocials;

        console.log(socials);
    }

    onMount(async () => {
        await updateGithubSocial();
    })

    $inspect("hii", socials)


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
    <section class="linktree-seg" id="linktree">
        <img class="lilac-cherry-branch" src="/img/branch2transparent.webp"
             alt="a sakura branch except flowers are lilac for some reason">
        <div class=chime-cont>
            {#each socials as social}
                <div class="social-chime">
                    <Chime {social} folds={social.folds} foldCount={4} chimeYOffset={0.15} chimeHeightVh="82vh"
                           separatorShape={SeparatorShape.ThreeStars}></Chime>
                </div>
            {/each}
        </div>
    </section>
    <p style="color: white">stars</p>
    <p style="color: white">gregor</p>

    <style>
        .linktree-seg {
            height: 200vh;
            width: 100vw;
            position: relative;

            display: flex;
            flex-direction: column;

            background-color: white;
            /* bg for testing */
            /*background-image: url("/img/train_front.webp");*/
            /*background-repeat: repeat;*/

            & .lilac-cherry-branch {
                width: 84vw;
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
                    top: 58vh;
                }
            }
        }
    </style>
{/key}