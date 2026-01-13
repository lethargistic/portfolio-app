<script lang="ts">
    import {currentLang, editorSocials} from "$lib/shared.svelte";

    import {onMount} from "svelte";
    import Chime from "$lib/hangies/Chime.svelte";
    import EditorTools from "$lib/editing/EditorTools.svelte";

    let {socials: socialsProp} = $props();

    let socials: typeof socialsProp = $derived(editorSocials.state);

    const extended = $state(false);
    const isSocialHidden = (social: typeof socials[number]) => social.hidden || (social.extended && !extended);

    const updateSocials = async () => {
        editorSocials.state = socialsProp;

        if (!socials) return;
        for (const social of socials) {
            if (isSocialHidden(social)) continue;

            let freshFoldsRes = await fetch("/api/v1/update-social", {
                method: "POST",
                body: JSON.stringify({
                    social: social.name
                }),
                headers: {
                    'content-type': 'application/json'
                }
            });

            const freshFolds = await freshFoldsRes.json();

            if (freshFolds.message) {
                console.error(freshFolds.message);
                return null;
            }

            // reactivity incantations
            const _socials: typeof socialsProp = socials;
            _socials[socials.findIndex((s: typeof socials[number]) => s.name === social.name)].folds
                = freshFolds;

            editorSocials.state = _socials;
            socials = _socials;
        }
    }

    onMount(async () => {
        await updateSocials();
    })

    let branchHeight = $state(1);
    let windowHeight = $state(1);

    let windowScrollY = $state(0);
    let smoothScrollY = $state(0);
    let scrolling = $state(false);

    const lerpParallaxScroll = () => {
        smoothScrollY += (windowScrollY - smoothScrollY) * 0.05;
        requestAnimationFrame(lerpParallaxScroll);
    }

    let windBlur = $state(0);
    let startTime = Date.now();

    const animateWindBlur = () => {
        const elapsed = (Date.now() - startTime) / 14000;
        windBlur = Math.sin(elapsed * Math.PI * 2) * 1.1;
        requestAnimationFrame(animateWindBlur);
    }

    onMount(() => {
        lerpParallaxScroll();
        animateWindBlur();
    })

    const handleScrollBool = () => scrolling = true;
    const handleScrollEndBool = () => scrolling = false;
</script>

<svelte:window bind:innerHeight={windowHeight} bind:scrollY={windowScrollY} onscroll={handleScrollBool}
               onscrollend={handleScrollEndBool}/>
{#key currentLang.lang}
    <section class="linktree-seg" id="linktree">
        <EditorTools seg={'linktree'}/>
        <img bind:clientHeight={branchHeight} class="lilac-cherry-branch" src="/img/branch2transparent.webp"
             alt="a sakura branch except flowers are lilac for some reason">
        {#each [0, 1, 2] as i}
            {@const highest = 2}
            <img class={`mathboils mathboils-layer-${i}`} style={
            `transform: translateY(${smoothScrollY * (0.05 + i * 0.01)}px);
             filter: blur(${scrolling ? ((i+0.5)*0.3)+windBlur : windBlur}px);
             transition: filter ${i*0.01+0.6}s ease-in-out;
             top: -${30-10*(highest-i)}vh;
             opacity: ${0.8-i*0.15};
             `}
                 src={`/img/linktree-decor/mathboils-layer-${i}.webp`}
                 alt="linktree background, various simple geometric shapes made with thin lines">
        {/each}
        <div class=chime-cont>
            {#each socials as social}
                {#if !isSocialHidden(social)}
                    <div class={`social-chime social-chime-${social.name}`}
                         style={`top: ${social.top_vh*(branchHeight/windowHeight)}vh; transform: translate(-${social.left_vw}%, 0); left: ${social.left_vw}vw`}>
                        <Chime {social} chimeYOffset={0.15}
                               chimeMaxHeightVh={82}/>
                    </div>
                {/if}
            {/each}
        </div>
    </section>
    <p style="color: white">stars</p>
    <p style="color: white">gregor</p>

    <style>
        .linktree-seg {
            height: 300vh;
            width: 100vw;
            position: relative;

            display: flex;
            flex-direction: column;

            background-color: white;

            & .lilac-cherry-branch {
                position: relative;
                z-index: 1;
                pointer-events: none;

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

                    pointer-events: none;
                }
            }

            & .mathboils {
                position: absolute;
                z-index: 0;
                top: 20vh;
                width: 100vw;
                will-change: transform;
                user-select: none;
            }
        }
    </style>
{/key}