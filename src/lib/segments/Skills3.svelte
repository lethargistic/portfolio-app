<script lang="ts">
    import {currentLang} from "$lib/shared.svelte";


    const socials = [
        {name: "github", link: "https://github.com/maksiksq"},
        {name: "chaos-abyss", link: "https://www.chaos-abyss.com/"},
        {name: "bluesky", link: "https://bsky.app/profile/maksiks.bsky.social"},
        {name: "linkedin", link: "https://www.linkedin.com/in/maksiksq/"},
    ]
</script>


{#key currentLang.lang}
    <section class="skills-seg" id="skills">
        greg
        <img class="lilac-cherry-branch" src="/img/branch2transparent.webp" alt="a sakura branch except flowers are lilac for some reason">
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
    <style>
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