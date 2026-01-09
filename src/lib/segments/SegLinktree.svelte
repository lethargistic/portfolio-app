<script lang="ts">
    import {currentLang} from "$lib/shared.svelte";

    import {onMount} from "svelte";
    import Chime from "$lib/hangies/Chime.svelte";
    import EditPencil from "$lib/components/EditPencil.svelte";

    let {socials: socialProp} = $props();

    let socials: typeof socialProp = $state();

    const extended = $state(false);
    const isSocialHidden = (social: typeof socials[number]) => social.hidden || (social.extended && !extended);


    const updateSocials = async () => {
        socials = socialProp;
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
            const oldSocials: typeof socialProp = socials;
            oldSocials[socials.findIndex((s: typeof socials[number]) => s.name === social.name)].folds
                = freshFolds;

            socials = oldSocials;
        }
    }

    onMount(async () => {
        await updateSocials();
    })

    let branchHeight = $state(1);
    let windowHeight = $state(1);
</script>

<svelte:window bind:innerHeight={windowHeight}></svelte:window>
{#key currentLang.lang}
    <section class="linktree-seg" id="linktree">
        <EditPencil />
        <img bind:clientHeight={branchHeight} class="lilac-cherry-branch" src="/img/branch2transparent.webp"
             alt="a sakura branch except flowers are lilac for some reason">
        <img class="mathboils" src="/img/mathboils.webp" alt="linktree background, various geometric shapes made with thin lines">
        <div class=chime-cont>
            {#each socials as social}
                {#if !isSocialHidden(social)}
                    <div class={`social-chime social-chime-${social.name}`} style={`top: ${social.top_vh*(branchHeight/windowHeight)}vh; transform: translate(-${social.left_vw}%, 0); left: ${social.left_vw}vw`}>
                        <Chime {social} folds={social.folds} foldCount={social.fold_count} chimeYOffset={0.15} chimeMaxHeightVh={82}
                               separatorShape={social.separator_shape}></Chime>
                    </div>
                {/if}
            {/each}
        </div>
    </section>
    <p style="color: white">stars</p>
    <p style="color: white">gregor</p>

    <style>
        .linktree-seg {
            height: 260vh;
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

                    pointer-events: none;
                }
            }

            /* TODO: parallax background that twitches to mouse move and maybe wind?? oh my god how had this not crossed my mind before what the hell oh my god yes yes yes yes yes yes yes yes*/
            & .mathboils {
                position: absolute;
                top: 20vh;
                width: 100vw;
            }
        }
    </style>
{/key}