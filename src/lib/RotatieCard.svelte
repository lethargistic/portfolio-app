<script lang="ts">
    import {Spring, Tween} from "svelte/motion";
    import {blur} from "svelte/transition";
    import {
        activeEditor,
        editbar, editing,
        handleItemEdit,
        handleItemHolding,
        handleItemLeaving,
        handlePositioning, modal, pxToVw, vwToPx, windowGlobals
    } from "$lib/shared.svelte";
    import {untrack} from "svelte";
    import {expoOut} from "svelte/easing";

    let {proj} = $props();
    let rotatie: HTMLElement | null = $state(null);

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
    let scaleInit = 1;
    let scaleTarget = 1.05;
    let scale = new Spring(scaleInit);
    const shadowScaleInit = 0.99;
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
        shadowScale.target = 0.96;
        scale.target = scaleTarget;

        handlePositioning(e, projInQuestion, proj.name, 'web');
    }
    const handlePointerLeave = () => {
        act = false;
        scale.target = scaleInit;
        shadowScale.target = shadowScaleInit;
        rotation.target = {x: 0, y: 0};
    }

    //

    let selected = $derived(modal.selected === proj.name);
    const handleCardInteraction = (e: Event | null, skip: boolean = false) => {
        if (e instanceof KeyboardEvent && !(e.key === ' ' || e.key === 'Enter')) return;

        if (editing.state && e !== null) {
            handleItemEdit(e, proj.name, 'web-modifying');
        } else if (modal.open && !skip) {
            modal.open = false;
        } else {
            modal.selected = proj.name;
            modal.open = true;
            // TODO maybe: adjust coef
            modal.left = vwToPx(proj.left_vw) > windowGlobals.inner_width / 4

            if (!rotatie) return;
            const rect = rotatie.getBoundingClientRect();

            const elemBottom = rect.bottom + window.scrollY - window.innerHeight;
            const scrollToY = elemBottom + window.innerHeight / 2.4 - rotatie.offsetHeight / 2;
            scrollTo({top: scrollToY, behavior: 'smooth'});
            document.documentElement.classList.add('scroll-lock');
        }
    }

    $effect(() => {
        if (modal.travel && selected) {
            handleCardInteraction(null, true);
            modal.travel = false;
        }
    })

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
            shadowClone.style.left = proj.left_vw + offset.current.x + 'vw';
            shadowClone.style.top = proj.top_vh + offset.current.y + 'vh';
            shadowClone.style.scale = '0.99';

            once = true;
        }

        shadowClone.style.transform = `scale(${shadowScale.current})`;
    }
    $effect(() => {
        resizeAndAnimateShadow(false)
    })

    $effect(() => {
        if (windowGlobals.inner_width && windowGlobals.inner_height) {
            resizeAndAnimateShadow(true);
        }
    })

    //

    let offset = new Tween({x: 0, y: 0}, {
        duration: 800,
        easing: expoOut
    });

    $effect(() => {
        if (modal.open && selected) {
            untrack(() => {
                offset.target = {x: (pxToVw(windowGlobals.inner_width * (modal.left ? 0.75 : 0.25) - vwToPx(proj.width_vw / 2))) - proj.left_vw, y: 0}
                resizeAndAnimateShadow(true)
            })
        } else {
            untrack(() => {
                offset.target = {x: 0, y: 0}
                resizeAndAnimateShadow(true)
            })
        }
    })
</script>

<svelte:window/>
<div bind:this={rotatie} class={`card ${selected ? 'selected' : ''}
            ${activeEditor.state === 'web-modifying'
            || activeEditor.state === 'web-positioning' ? 'hover-focus-light' : ''}
            ${editbar.holding ? 'prevent-select' : ''}`}
     style={`transform: perspective(600px) rotateX(${rotation.current.x}deg) rotateY(${rotation.current.y}deg) scale(${scale.current});
             left: ${proj.left_vw + offset.current.x}vw; top: ${proj.top_vh}vh; width: ${proj.width_vw + offset.current.y}vw;`}
     onpointerdown={handleItemHolding}
     onpointermove={handleCardMoving} onpointerup={handleItemLeaving}
     onpointerout={(e) => {handlePointerLeave(); handleItemLeaving(e)}}
     onclick={handleCardInteraction} onkeydown={handleCardInteraction}
     role="button"
     tabindex="0"
     bind:clientWidth={cardWidth}
     bind:clientHeight={cardHeight}
     bind:this={card}>
    {#if act && !modal.open}
        <p transition:blur style={`right: ${arrowRight.current}rem`} class="arrow">-&gt;</p>
    {/if}
    <div class="card-info">
        <h3>{proj.display_name}</h3>
        <p class="blurb">{proj.blurb}</p>
        <div class="separator"></div>
        <p class="num">{proj.read_num.toString().padStart(2, '0')}</p>
    </div>
    <div class={`img-wrap ${modal.open && selected ? 'modal-open' : ''}`}>
        <img bind:this={img} bind:clientWidth={imgDims.width} bind:clientHeight={imgDims.height}
             class={`${editbar.holding ? 'prevent-select' : ''}`} src={proj.img} alt={proj.name}/>
    </div>
</div>
<div bind:this={shadowClone}
     class="shadow-clone"></div>

<style>
    .selected {
        z-index: 1000 !important;
    }

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

                -webkit-user-drag: none;
                user-drag: none;
                user-select: none;

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
                transition: opacity 0.6s;
                pointer-events: none;
            }

            &:after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: calc(100% - 5px);
                background: linear-gradient(to right, rgba(0, 0, 0, 0.4), transparent);
                transition: opacity 0.1s ease-out;
                pointer-events: none;
                opacity: 0;
            }
        }

        & .modal-open:before {
            opacity: 0;
        }

        & .modal-open:after {
            opacity: 1;
        }
    }
</style>