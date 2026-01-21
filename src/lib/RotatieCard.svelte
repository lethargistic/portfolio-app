<script lang="ts">
    import {Spring, Tween} from "svelte/motion";
    import {blur} from "svelte/transition";
    import {
        activeEditor,
        editbar,
        handleItemEdit,
        handleItemHolding,
        handleItemLeaving,
        handlePositioning, windowGlobals
    } from "$lib/shared.svelte";

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
    const shadowScaleInit = 1;
    let shadowScale = new Tween(shadowScaleInit);
    let arrowRight = new Spring(10);

    const projInQuestion = $derived<Record<string, any>>(editbar.proj_data[editbar.focusedIx]);
    const handleCardMoving = (e: PointerEvent) => {
        if (!card) return;

        act = true;
        const pointerX = e.clientX;
        const pointerY = e.clientY;

        rotation.target = {
            x: (pointerY - card.offsetTop - cardHeight / 2) / 16,
            y: -(pointerX - card.offsetLeft - cardWidth / 2) / 24
        };
        shadowScale.target = 0.95;
        scale.target = 1.05;

        handlePositioning(e, projInQuestion, proj.name, 'web');
    }
    const handlePointerLeave = () => {
        act = false;
        scale.target = 1;
        shadowScale.target = shadowScaleInit;
        rotation.target = {x: 0, y: 0};
    }

    //

    let shouldLink = $state(true)
    const handleProjectEdit = (e: Event) => {
        if (e instanceof KeyboardEvent && e.key !== ' ') return;

        shouldLink = !activeEditor.state.startsWith('web');
        handleItemEdit(e, proj.name, 'web-modifying');
    }

    //

    const trackArrowLoad = () => {
        act ? arrowRight.target = 1 : arrowRight.target = 10
    };
    $effect(trackArrowLoad);

    //

    let img: HTMLElement | null = $state(null);
    let imgDims = $state<Record<string, any>>({
        width: 0,
        height: 0
    });

    let once = $state(false);
    let shadowClone: HTMLDivElement | null = $state(null);
    const resizeAndAnimateShadow = (resize: boolean) => {
        if (!shadowClone || !img || !imgDims.width || !imgDims.height) return;

        if (!once || resize) {
            shadowClone.style.width = imgDims.width + 'px';
            shadowClone.style.height = imgDims.height + 'px';
            shadowClone.style.left = proj.left_vw + 'vw';
            shadowClone.style.top = proj.top_vh + 'vh';
            shadowClone.style.scale = '0.99';

            once = true;
        }

        shadowClone.style.transform = `scale(${shadowScale.current})`;
    }
    $effect(() => {resizeAndAnimateShadow(false)})
    
    $effect(() => {
        if (windowGlobals.inner_width && windowGlobals.inner_height) {
            resizeAndAnimateShadow(true);
        }
    })
</script>

<svelte:window />
<a target="_blank" class={`card
            ${activeEditor.state === 'web-modifying'
            || activeEditor.state === 'web-positioning' ? 'hover-focus-light;' : ''}
            ${editbar.holding ? 'prevent-select' : ''}`}
   href={shouldLink ? proj.link : null}
   style={`transform: perspective(600px) rotateX(${rotation.current.x}deg) rotateY(${rotation.current.y}deg) scale(${scale.current});
             left: ${proj.left_vw}vw; top: ${proj.top_vh}vh; width: ${proj.width_vw}vw;`}
   onpointerdown={(e) => {handleProjectEdit(e); handleItemHolding(e);}}
   onpointermove={handleCardMoving} onpointerup={handleItemLeaving}
   onpointerout={(e) => {handlePointerLeave(); handleItemLeaving(e)}}
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
        <img bind:this={img} bind:clientWidth={imgDims.width} bind:clientHeight={imgDims.height}
             class={`${editbar.holding ? 'prevent-select' : ''}`} src={proj.img} alt={proj.name}/>
    </div>
</a>
<div bind:this={shadowClone}
     class="shadow-clone"></div>

<style>
    .shadow-clone {
        position: absolute;
        background: rgba(0, 0, 0, 0.3);
        filter: blur(10px);

        width: 200px;
        height: 200px;
        /*box-shadow: rgba(240, 46, 170, 0.4) -5px 5px, rgba(240, 46, 170, 0.3) -10px 10px, rgba(240, 46, 170, 0.2) -15px 15px, rgba(240, 46, 170, 0.1) -20px 20px, rgba(240, 46, 170, 0.05) -25px 25px;*/
        box-shadow: rgba(0, 0, 0, 0.3) 0 19px 10px 1px, rgba(0, 0, 0, 0.22) 0 15px 6px;
    }

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
                /* no idea what are these 5px even from */
                /* the wrapper is just slightly bigger for some reason*/
                height: calc(100% - 5px);
                background: linear-gradient(to right, #111111, transparent);
                pointer-events: none;
            }
        }
    }
</style>