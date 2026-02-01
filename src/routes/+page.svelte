<script lang="ts">
    import SegWelcome from "$lib/segments/SegWelcome.svelte";
    import SegAbout from "$lib/segments/SegAbout.svelte";
    import SegLinktree from "$lib/segments/SegLinktree.svelte";
    import {goto} from "$app/navigation";
    import {
        activeEditor,
        animateTitleOverride,
        currentLang,
        editbar,
        editing,
        settings,
        t,
        windowGlobals
    } from "$lib/shared.svelte";
    import GlobalEditorTools from "$lib/editing/GlobalEditorTools.svelte";
    import {page} from "$app/state";
    import SegWeb from "$lib/segments/SegWeb.svelte";
    import {isEmptyArr} from "$lib/utils/utils";
    import {getLocale} from "$lib/paraglide/runtime";
    import {onMount} from "svelte";
    import SegFooter from "$lib/segments/SegFooter.svelte";
    import toast from 'svelte-french-toast'
    import ToastErrorCustom from "$lib/toasts/ToastErrorCustom.svelte";
    import SegOther from "$lib/segments/SegOther.svelte";

    let {form, data} = $props();

    const cheatCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight'];
    let codeIx = 0;
    const maxDelay = 3000;
    let past = Date.now();

    const handleTravelToAuth = (e: KeyboardEvent) => {
        const now = Date.now();

        if (now - past > maxDelay) {
            codeIx = 0;
        }

        past = now;

        if (e.key === cheatCode[codeIx]) {
            codeIx++;
            if (codeIx === cheatCode.length) {
                goto('/admin/login');
                codeIx = 0;
            }
        } else {
            codeIx = 0;
        }
    }

    //

    let pulledSettings = $state(false);
    const manageSettings = () => {
        if (pulledSettings) {
            localStorage.setItem('settings', JSON.stringify(settings));
        } else {
            const oldSettings = localStorage.getItem('settings');

            if (!oldSettings) {
                pulledSettings = true;
                return;
            }
            const oldSettingsJSON = JSON.parse(oldSettings);
            const settingsKeys = Object.keys(settings);

            for (const [key, value] of Object.entries(oldSettingsJSON as typeof settings)) {
                if (!settingsKeys.includes(key)) continue;
                settings[key].state = value.state;
            }

            if (page.url.hash === '#linktree') {
                settings.extended_linktree.state = true;
            }

            pulledSettings = true;
        }
    }
    $effect(manageSettings);

    const updateFocused = (prefix: string, data: Array<Record<string, any>>) => {
        if (!activeEditor.state.startsWith(prefix)) return;

        if (isEmptyArr(data)) {
            editbar.focusedIx = -1;
            return;
        }

        const ix = data.findIndex(social => social.name === editbar.focused);
        if (ix === null) {
            editbar.focusedIx = -1;
            return;
        }
        editbar.focusedIx = ix;
    }
    $effect(() => (updateFocused('lnkt', editbar.social_data)));
    $effect(() => (updateFocused('web', editbar.proj_data)));

    //

    onMount(() => {
        currentLang.lang = getLocale();
    })

    //

    let toastSettingTxt = $derived(t.sound_setting_toast());
    const validateSoundSetting = async () => {
        const checkSound = new Audio('/audio/1sec-silence.mp3');

        try {
            await checkSound.play()
        } catch (e) {
            if (e instanceof DOMException && e.name === "NotAllowedError") {
                if (settings.sounds.state) {
                    // @ts-ignore
                    toast.error(ToastErrorCustom, {props: {
                            text: toastSettingTxt
                        },
                        position: "bottom-end",
                        duration: 5000
                    })
                }
                settings.sounds.state = false;
            } else {
                throw e;
            }
        }
    }

    onMount(validateSoundSetting);


    // what a slightly dumb way to do this 2024 maksiks
    let title = $state('maksiks');
    let titleIx = 0;
    let curTitle = '';
    const initSubName = 'maksiksq';
    let switcher = false;

    const animateTitle = () => {
        const interval = setInterval(() => {
            switcher = !switcher;

            if (!settings.title_animation.state) {
                title = iniTitle;
                return;
            }

            if (titleIx === initSubName.length
                && !animateTitleOverride.state) return;

            if (titleIx < initSubName.length) {
                titleIx++;
                curTitle = iniTitle.slice(0, titleIx);
            } else {
                setTimeout(() => {
                    titleIx = 0;
                    curTitle = '';
                    switcher = false;
                }, 1000);
            }

            title = curTitle + (switcher ? "▮" : " ");
        }, 1000);

        return () => clearInterval(interval);
    }

    $effect(() => {
        if (!settings.title_animation.state) {
            title = iniTitle;
        }
    })

    onMount(() => {
        setTimeout(() => {
            return animateTitle();
        }, 3000)
    });

    let scrollY = $state(0);
    $effect(() => {
        animateTitleOverride.state = !(scrollY > windowGlobals.inner_height);
    })

    const iniTitle = 'maksiks ';
    const desc = "Maksiks's personal void, come grab a tea.";
    const canonUrl = "https://maksiks.is-a.dev/";
    const ogImgPath = "https://maksiks.is-a.dev/img/ogimg.png";

    const metaNamed = [
        { name: "description", content:  desc},
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: iniTitle },
        { name: "twitter:description", content: desc },
        { name: "twitter:image", content: ogImgPath },
        { name: "author", content: "Maksiks" }
    ];

    const metaProperty = [
        { property: "og:type", content: "website" },
        { property: "og:title", content: iniTitle },
        { property: "og:description", content: desc },
        { property: "og:url", content: canonUrl },
        { property: "og:image", content: ogImgPath }
    ]

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Maksiks",
        "url": "https://maksiks.is-a.dev/",
        "email": "maksiks.touch@gmail.com",
        "sameAs": [
            "https://github.com/maksiksq",
            "https://www.linkedin.com/in/maksiksq/",
            "https://bsky.app/profile/maksiks.bsky.social"
        ],
        "jobTitle": "Software Developer",
        "knowsAbout": [
            "Software Development",
            "JavaScript",
            "TypeScript",
            "Svelte",
            "React",
            "Web dev"
        ],
        "alumniOf": "Vifc NUFT",
        "description": "Maksiks is a self-taught software developer with a passion for Japanese, games, media, and design.",
        "image": "https://maksiks.is-a.dev/img/pfp.webp"
    };
</script>



<svelte:head>
    <title>{title}</title>
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href={canonUrl}>

    {#each metaNamed ?? [] as meta (meta.name)}
        <meta name={meta.name} content={meta.content}/>
    {/each}
    {#each metaProperty ?? [] as meta (meta.property)}
        <meta property={meta.property} content={meta.content}/>
    {/each}
    {@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`}
</svelte:head>

<svelte:window on:keydown={handleTravelToAuth} bind:scrollY={scrollY}/>

{#if editing.state && settings.editor.state}
    <div class="editing">
        <p>Editing</p>
        <small>{activeEditor.state}</small>
    </div>
{/if}
<GlobalEditorTools {form}/>
<main>
    <SegWelcome/>
    <SegAbout/>
    <SegLinktree socials={data.socials}/>
    <SegWeb webProj={data.web_projects} webProjDetails={data.web_projects_details}/>
    <SegOther others={data.others}/>
    <!-- TODO eventually: art sec -->
    <SegFooter/>
</main>

<style>
    .editing {
        position: fixed;
        color: white;
        background-color: black;
        padding: 0.8rem 1.2rem;
        z-index: 9999999;

        opacity: 0.5;

        font-size: 2rem;
        left: 28px;
        top: 100px;
    }
</style>