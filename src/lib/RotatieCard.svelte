<script lang="ts">
    import {Spring} from "svelte/motion";
    import {blur} from "svelte/transition";
    import {activeEditor, handleEdit} from "$lib/shared.svelte";

    let {proj} = $props();

    // when thinking what to do for this section i remembered
    // a portfolio website that someone sent me on discord ages ago
    // i really liked the concept of rotating project frames like this
    // so took a look before making this.
    // wasn't originally going to credit them as i use lots of sites
    // for inspiration, particularly on creative projects like this,
    // but making it rn, it seems so eerily similar that it kinda feels like
    // i'm stealing which doesn't feel right
    // albeit it's probably just natural UX choices and me overthinking it
    // but consider this my inspiration for the section: https://yasio.dev/

    let act = $state(false)
    let card: HTMLElement | null = $state(null);
    let cardWidth = $state(0);
    let cardHeight = $state(0);
    let rotation = new Spring({x: 0, y: 0}, {
        stiffness: 0.01,
        damping: 0.08
    });
    let scale = new Spring(1);
    let arrowRight = new Spring(10);

    const handlePointerMove = (e: PointerEvent) => {
        if (!card) return;

        act = true;
        const pointerX = e.clientX;
        const pointerY = e.clientY;

        rotation.target = {
            x: (pointerY - card.offsetTop - cardHeight / 2) / 16,
            y: -(pointerX - card.offsetLeft - cardWidth / 2) / 24
        };
        scale.target = 1.05;
    }
    const handlePointerLeave = () => {
        act = false;
        scale.target = 1;
        rotation.target = {x: 0, y: 0};
    }

    // the shadow remains flat when rotated so we basically have to remove it
    // TODO maybe: make pseudo shadow that only rotates on y
    const inactiveShadow = "rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px";
    const activeShadow = "rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;";

    //

    let shouldLink = $state(true)
    const handleProjectEdit = (e: Event) => {
        shouldLink = !activeEditor.state.startsWith('web');
        handleEdit(e, proj.name, 'web-modifying');
    }

    //

    const trackArrowLoad = () => {
        act ? arrowRight.target = 1 : arrowRight.target = 10
    };
    $effect(trackArrowLoad);
</script>

<a target="_blank" class={`card
            ${activeEditor.state === 'web-modifying'
            || activeEditor.state === 'web-positioning' ? 'hover-focus-light' : ''}`}
         href={shouldLink ? proj.link : null}
   style={`transform: perspective(600px) rotateX(${rotation.current.x}deg) rotateY(${rotation.current.y}deg) scale(${scale.current});
             left: ${proj.left_vw}vw; top: ${proj.top_vh}vh; width: ${proj.width_vw}vw;`}
   onpointermove={handlePointerMove} onpointerout={handlePointerLeave}
   onclick={handleProjectEdit} onkeydown={handleProjectEdit}
   bind:clientWidth={cardWidth}
   bind:clientHeight={cardHeight}
   bind:this={card}>
    {#if act}
        <p transition:blur style={`right: ${arrowRight.current}rem`} class="arrow">-&gt;</p>
    {/if}
    <div class="card-info">
        <h3>{proj.display_name}</h3>
        <p class="blurb">{proj.blurb}</p>
        <div class="separator"></div>
        <p class="num">{proj.read_num.toString().padStart(2, '0')}</p>
    </div>
    <div class="img-wrap">
        <img style={`box-shadow: ${act ? activeShadow : inactiveShadow};`} src={proj.img} alt={proj.name}/>
    </div>
</a>

<style>
    .card {
        position: absolute;
        z-index: 2;
        cursor: pointer;

        display: flex;

        --inner-text-opacity: 0.5;

        * {
            font-family: 'Fira Code', monospace;
        }

        & .arrow {
            position: absolute;
            top: 1rem;
            right: 10rem;
            z-index: 3;

            text-shadow: rgba(0, 0, 0, 0.6) 0 1px 5px, rgba(0, 0, 0, 0.4) 0 -1px 3px;
        }

        .card-info {
            width: 50%;

            display: grid;
            align-self: end;

            position: absolute;
            margin-left: -15%;
            z-index: 3;

            & h3 {
                font-weight: normal;
                font-size: 2rem;

                padding-bottom: 0.5rem;
            }

            & .blurb {
                opacity: var(--inner-text-opacity);
                font-size: 1rem;

                padding-bottom: 1rem;
            }

            & .separator {
                background: white;
                width: 100%;
                height: 2px;
                margin-bottom: 1rem;
                border-radius: 4px;
            }

            & .num {
                display: flex;
                opacity: var(--inner-text-opacity);
                width: 100%;
                font-size: 0.9rem;

                margin-bottom: 1.5rem;
            }
        }

        & .img-wrap {
            position: relative;

            & img {
                width: 100%;
                aspect-ratio: 16/9;

                transition: box-shadow 0.5s;
            }

            &:before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(to right, #111111, transparent);
                pointer-events: none;
            }
        }
    }
</style>