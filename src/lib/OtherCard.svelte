<script lang="ts">
    import {
        deviceMin,
        editbar,
        editing,
        handleItemEdit,
        handleItemHolding,
        handleItemLeaving,
        handlePositioning, modal, pxToVh, pxToVw, scrollToCard, vhToPx, vwToPx, windowGlobals
    } from "$lib/shared.svelte";
    import {untrack} from "svelte";
    import {Tween} from "svelte/motion";
    import {expoOut} from "svelte/easing";

    let {other} = $props();

    let otherInQuestion = $derived<Record<string, any>>(editbar.other_data[editbar.focusedIx]);
    let selected = $derived(modal.selected === other.name);

    let card: HTMLElement | null = $state(null);

    const handleOtherInteraction = (e: Event | null, skip: boolean = false) => {
        if (e instanceof KeyboardEvent && !(e.key === ' ' || e.key === 'Enter')) return;

        if (editing.state && e !== null) {
            handleItemEdit(e, other.name, 'other-modifying');
        } else if (modal.open && !skip) {
            modal.open = false;
        } else {
            modal.owner = 'other';
            modal.selected = other.name;
            modal.open = true;
            modal.left = vwToPx(other.right_vw) < windowGlobals.inner_width / 4

            if (!card) return;
            scrollToCard(card);
        }
    }

    $effect(() => {
        if (modal.travel && selected) {
            handleOtherInteraction(null, true);
            modal.travel = false;
        }
    })

    let offset = new Tween({x: 0, y: 0}, {
        duration: 800,
        easing: expoOut
    });
    let top = $derived(deviceMin.mobile ? offset.current.y : other.top_vh);

    let cardHeight = $state(0);

    $effect(() => {
        if (modal.open && selected) {
            untrack(() => {
                offset.target = {
                    x: (pxToVw(windowGlobals.inner_width * (modal.left ? 0.25 : 0.75) - vwToPx(other.width_vw / 2))) - other.right_vw,
                    y: deviceMin.mobile ? (pxToVh(windowGlobals.inner_height * 0.635 - vhToPx(cardHeight / 2))) : 0
                }
            })
        } else {
            untrack(() => {
                offset.target = {x: 0, y: 0}
            })
        }
    });
</script>

<div bind:this={card} bind:clientHeight={cardHeight} style={`
    width: ${other.width_vw}vw;
    right: ${deviceMin.mobile ? 0 : other.right_vw + offset.current.x}vw;
    top: ${top}vh;
    `} class={`other-card ${selected ? 'over-modal' : ''}`}
     onpointerdown={handleItemHolding}
     onpointermove={(e) => handlePositioning(e, otherInQuestion, other.name, 'other', true)}
     onpointerup={handleItemLeaving}
     onpointerout={(e) => {handleItemLeaving(e)}}
     onclick={handleOtherInteraction} onkeydown={handleOtherInteraction}
     role="button"
     tabindex="0">
    <img class="frame" src="/img/other-frame.webp" alt="a frame">
    <h3 class="display">{other.display_name}</h3>
    <div class="img-wrap">
        <img class={`${selected && modal.open ? 'selected' : ''}`} src={other.img} alt={other.display_name}>
    </div>
</div>

<style>
    .selected {
        filter: grayscale(0) !important;
    }

    .other-card {
        width: 24vw;
        position: absolute;
        top: 30vw;

        z-index: 1;

        & .display {
            position: absolute;
            z-index: 3;
            left: -26%;
            top: 8%;

            padding: 0 0.2rem 0 1rem;

            background-color: rgba(0, 0, 0, 0.59);

            font-family: Tiny5, sans-serif;
            font-weight: normal;
            font-size: 2rem;
            letter-spacing: 0.6rem;
        }

        & .img-wrap {
            cursor: pointer;
            position: relative;
            transform: translate(-50%, 0);
            left: 50%;
            top: 50%;


            & img {
                user-select: none;
                user-drag: none;
                -webkit-user-drag: none;
                width: 100%;

                transition: filter 0.25s ease;
                filter: grayscale(50%);

                &:hover {
                    filter: grayscale(0)
                }
            }
        }

        & .frame {
            image-rendering: pixelated;
            width: 125%;
            position: absolute;
            transform: translate(-50%, -50%);
            z-index: 2;
            pointer-events: none;
            left: 50%;
            top: 48%;
            filter: drop-shadow(0 1px 0 #ccc) drop-shadow(0 3.8px 0 #c9c9c9);

            user-select: none;
            user-drag: none;
            -webkit-user-drag: none;

        }
    }
</style>