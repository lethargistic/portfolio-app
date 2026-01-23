<script lang="ts">
    import {currentLang, editbar, MAX_CHIME_FOLDS, settings} from "$lib/shared.svelte";

    import {onMount} from "svelte";
    import Chime from "$lib/hangies/Chime.svelte";
    import EditorTools from "$lib/editing/EditorTools.svelte";
    // jetbrains fix when
    import { positionTooltip} from "$lib/shared.svelte";

    let {socials: socialsProp} = $props();

    let socials = $derived(editbar.social_data);

    const isSocialHidden = (social: typeof socials[number]) => social.hidden || (social.extended && !settings.extendedLinktree.state);

    const updateSocials = async () => {
        editbar.social_data = socialsProp;

        if (!socials) return;
        for (const social of socials) {
            if (isSocialHidden(social)) continue;

            let freshFoldsRes = social.stats ? await fetch("/api/v1/update-social", {
                method: "POST",
                body: JSON.stringify({
                    social: social.name
                }),
                headers: {
                    'content-type': 'application/json'
                }
            }) : null;

            const freshFolds = freshFoldsRes ? await freshFoldsRes.json() : social.folds;

            if (freshFolds.message) {
                console.error(freshFolds.message);
                return null;
            }

            // reactivity incantations
            const _socials: typeof socialsProp = socials;
            _socials[socials.findIndex((s: typeof socials[number]) => s.name === social.name)].folds
                = freshFolds;

            editbar.social_data = _socials;
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

    //

    let socialsLength = $derived(socials.length);

    // TODO: refactor Linktree tooltip pipeline
    // should have used data attributes instead of refs
    // or actually i could just render a copy elsewhere instead of
    // manipulating data
    let foldStatElems: Array<Array<Record<string, HTMLElement | null>>> = $derived(Array.from({length: socialsLength}, () => {
        return Array.from({length: MAX_CHIME_FOLDS * 2}, () => {return {elem: null}});
    }));
    let foldTooltipOverride: string | null = $state(null);
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
        <div class="chime-cont">
            {#each socials as social, i (social.name + i)}
                {#if !isSocialHidden(social)}
                    <div class={`social-chime social-chime-${social.name}`}
                         style={`top: ${social.top_vh*(branchHeight/windowHeight)}vh;
                         transform: translate(-${social.left_vw}%, 0);
                         left: ${social.left_vw}vw;
                         z-index: ${social.above ? '999' : '0'};
                         `}>
                        <Chime {social} socialIx={i} bind:foldStatElems={foldStatElems} bind:foldTooltipOverride={foldTooltipOverride}/>
                    </div>

                    <!-- tooltips -->
                    {#each social.folds as fold, j (fold.slug + j)}
                        {#if fold.tooltip_on && fold.tooltip_text !== ''}
                            <!-- jetbrains fix when -->
                            <!--suppress ALL-->
                            <div {@attach positionTooltip(foldStatElems[i][j].elem)}
                                 class="tooltip" role="tooltip">
                                <div>
                                    {@html foldTooltipOverride ? foldTooltipOverride : (fold.tooltip_text ? fold.tooltip_text : '')}
                                </div>
                            </div>
                        {/if}
                    {/each}
                {/if}
            {/each}
        </div>
    </section>

    <style>
        .tooltip {
            width: max-content;
            position: absolute;
            top: 0;
            left: 0;
            font-weight: bold;
            font-size: 90%;
            z-index: 99999;
        }

        .tooltip > div {
            background: rgba(248, 242, 255, 0.4);
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(2px);
            -webkit-backdrop-filter: blur(2px);
            color: #000000;
            border-radius: 0;
            padding: 0.2rem 0.6rem;
            margin-bottom: 0.6rem;
            border: 1px solid #111111;
            font-size: 0.85rem;
            font-weight: bold;
        }

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
                -webkit-user-drag: none;
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