<script lang="ts">
    import {
        activeEditor,
        editing,
        hackeryTextAnim,
        handleItemEdit,
        positionTooltip,
        modal
    } from "$lib/shared.svelte";
    import Icon from "$lib/Icon.svelte";
    import {blur} from "svelte/transition";
    import {expoIn, expoOut, cubicInOut} from "svelte/easing";
    import EditorTools from "$lib/editing/EditorTools.svelte";
    import {untrack} from "svelte";

    const {selectedDetails: details, selectedProj: proj, webProjDetails: allDetails} = $props();

    const closeModal = () => {
        modal.open = false;
    }

    let controls: HTMLElement | null = $state(null);
    let dialog: HTMLElement | null = $state(null);
    const handleModalCloseCheck = (e: Event) => {
        if (!controls || !dialog) return;
        if (e instanceof KeyboardEvent && e.key !== 'Escape') return;

        if (controls.contains(e.target as Node) || dialog.contains(e.target as Node)) {
            return;
        }

        closeModal();
    }

    const rotateSelected = (forwards: boolean) => {
        let newIx = modal.selectedIx + (forwards ? 1 : -1);

        if (newIx >= allDetails.length) {
            newIx = 0;
        } else if (newIx < 0) {
            newIx = allDetails.length - 1;
        }

        modal.travel = true;
        modal.selected = allDetails[newIx].name;
    }

    const handleDetailsInteraction = (e: Event) => {
        if (e instanceof KeyboardEvent && !(e.key === ' ' || e.key === 'Enter')) return;

        if (editing.state) {
            handleItemEdit(e, details.name, 'wb-inn-modifying');
        }
    }

    //

    let hElem: HTMLElement | null = $state(null);
    let descElem: HTMLElement | null = $state(null);

    let cleanupH: (() => void) | null = null;
    let cleanupDesc: (() => void) | null = null;
    let isOpen = $derived(!!details && modal.open);
    $effect(() => {
        if (details) {
            if (details.display_name && details.long_desc) {
                // reactivity
                // TODO maybe: remake anim properly
                // should have given it the state to edit instead of editing the elem's text content
                // but it started as an attachment and went on from there and not a big deal so whatever
            }
        }
        if (isOpen && modal.selected) {
            untrack(() => {
                if (cleanupH) cleanupH();
                if (cleanupDesc) cleanupDesc();
                if (!descElem || !hElem) return;

                cleanupH = hackeryTextAnim(hElem, 0.4, details.display_name);
                cleanupDesc = hackeryTextAnim(descElem, 6, details.long_desc);
            })
        }
    })
</script>

{#if isOpen}
    <div transition:blur={{duration: modal.open ? 500 : 400, easing: modal.open ? expoIn : expoOut}}
         style={`justify-content: ${modal.left ? 'flex-start' : 'flex-end'};`}
         class="modal" onclick={handleModalCloseCheck} onkeydown={handleModalCloseCheck}
         role="button" tabindex="-1">
        <div bind:this={controls} class="controls">
            <div class="arrows">
                <button onclick={() => rotateSelected(false)}>&lt;--</button>
                /
                <button onclick={() => rotateSelected(false)}>--&gt;</button>
                <!-- putting it here is a dumb idea but it works lol -->
                <EditorTools seg={'wb-inn'} light={true}/>
            </div>

            <button class="cross" onclick={closeModal}>
                <Icon name={'cross'} width={24} height={24} currentColor={'#fff'}/>
            </button>
        </div>
        <div bind:this={dialog} class={`dialog ${modal.left ? 'dialog-left' : 'dialog-right'}`}>
            <div
                    onclick={handleDetailsInteraction}
                    onkeydown={handleDetailsInteraction}
                    role="button"
                    tabindex="-1"
                    class={`info ${activeEditor.state === 'wb-inn-modifying' ? 'hover-focus-light' : ''}`}>
                <h2 bind:this={hElem}>{details.display_name}</h2>
                <div class="separator">
                    {#each [...Array(27).keys()] as i}
                        {#if i === 0}={/if}=/
                    {/each}==
                </div>
                <div class="info-props">
                    <p class="num">#{proj.read_num.toString().padStart(2, '0')}</p>
                    <ul class="langs">
                        tech used:
                        {#each details.langs as lang}
                            <li class="web-info-prop"
                                onpointerenter={() => lang.tooltip = true}
                                onpointerleave={() => lang.tooltip = false}>
                                <Icon name={lang.lang} width={20} height={20} currentColor="#fff"/>

                                {#if lang.tooltip}
                                    <!-- jetbrains fix when -->
                                    <!--suppress ALL-->
                                    <div {@attach positionTooltip(true)}
                                         transition:blur={{duration: 100, easing: cubicInOut}}
                                         class="tooltip" role="tooltip"
                                         onpointerenter={() => lang.tooltip = true}
                                         onpointerleave={() => lang.tooltip = false}>
                                        <div>
                                            {lang.display}
                                        </div>
                                    </div>
                                {/if}
                            </li>
                        {/each}
                    </ul>
                </div>
                <p bind:this={descElem} class="desc">&nbsp;-> {details.long_desc}</p>
                <div class="button-wrap">
                    {#if details.link}
                        <a href={details.link} class="cta cta-link" target="_blank">
                            take&nbsp;a&nbsp;look
                        </a>
                    {/if}
                    {#if details.link_github}
                        <a href={details.link_github} class="cta cta-github" target="_blank">
                            github
                        </a>
                    {/if}
                </div>
            </div>
        </div>
    </div>
{/if}

<style>
    :global(.web-info-prop > .factory-icon) {
        display: grid;
        place-items: center;
        margin-bottom: 0.1rem;
    }

    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(16, 16, 16, 0.9);
        backdrop-filter: blur(1px);
        z-index: 100000;

        color: white;
        display: flex;
        align-items: center;

        & * {
            font-family: 'Fira Code', monospace;
        }

        ::selection {
            color: black;
            background-color: white;
        }

        & .dialog-right {
            margin-right: 2rem;
        }

        & .dialog-left {
            margin-left: 2rem;
        }

        & .dialog {
            width: 50%;
            height: 100%;

            overflow-y: auto;
            overflow-x: hidden;
            display: flex;
            align-items: center;

            /* so it's click-throughable */
            pointer-events: none;

            & * {
                pointer-events: initial;
            }

            & .info {
                display: grid;
                gap: 1rem;

                & h2 {
                    font-family: 'Fira Code', monospace;
                    font-weight: normal;
                    font-size: 2.5rem;
                }

                & .info-props {
                    display: flex;
                    align-items: center;
                    gap: 1rem;

                    & .num {
                        margin-top: 1px;
                    }

                    & .langs {
                        list-style: none;
                        display: flex;
                        align-items: center;
                        gap: 1rem;

                        & .web-info-prop {
                            display: flex;
                            align-items: center;
                        }
                    }
                }

                & .desc {
                    width: 85%;
                    word-break: break-word;
                    line-height: 2rem;
                    white-space: pre-line;
                }
            }
        }

        & .controls {
            position: absolute;
            width: 100%;
            left: 0;
            top: 16px;
            z-index: 1001;

            display: flex;
            align-items: center;
            box-sizing: border-box;

            /* so it's click-throughable */
            pointer-events: none;

            & * {
                pointer-events: initial;
            }

            & .cross {
                all: unset;
                cursor: pointer;
                pointer-events: all;
                margin-left: auto;
                margin-right: 2rem;
            }

            & .arrows {
                margin-left: 1rem;

                & button {
                    all: unset;
                    cursor: pointer;
                }
            }
        }
    }

    .button-wrap {
        display: flex;

        & .cta-github:before {
            --shadowed-btn-color: #1b1820;
            background: var(--shadowed-btn-color);
            box-shadow: 0 0 0 1px var(--shadowed-btn-color);
        }

        & .cta-link:before {
            --shadowed-btn-color: #3e2471;
            background: var(--shadowed-btn-color);
            box-shadow: 0 0 0 1px var(--shadowed-btn-color);
        }

        & .cta-github:hover {
            background-color: #100e13;
        }

        & .cta-github:hover::before {
            box-shadow: 0 0 0 1px #0a060e;
        }

        & .cta-link:hover {
            background-color: #6c35af;
        }

        & .cta-link:hover::before {
            box-shadow: 0 0 0 1px #3a1c5c;
        }

        & .cta-github {
            all: unset;
            background-color: #19141e;
            border: 2px solid #2a1449;
        }

        & .cta-link {
            all: unset;
            background-color: #6728b3;
            border: 2px solid #3b225a;
        }

        & .cta {
            position: relative;
            cursor: pointer;
            width: min-content;
            display: grid;
            place-items: center;
            padding: 0.2rem 0.9rem 0.4rem 0.9rem;
            margin: 0.4rem 0.9rem 0.1rem 0.1rem;
            border-radius: 2px;

            /*transform: translate3d(0, 12px, -16px);*/
            transform-style: preserve-3d;
            transition: transform 150ms cubic-bezier(0, 0, 0.58, 1), background 150ms cubic-bezier(0, 0, 0.58, 1), -webkit-transform 150ms cubic-bezier(0, 0, 0.58, 1);
        }

        & .cta:before {
            position: absolute;
            content: '';
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;

            border-radius: inherit;
            transform: translate3d(0, 4px, -16px);
            transition: transform 150ms cubic-bezier(0, 0, 0.58, 1), box-shadow 150ms cubic-bezier(0, 0, 0.58, 1);
        }

        & .cta:hover {
            transform: translate(0, 4px);
        }

        & .cta:hover::before {
            transform: translate3d(0, 2px, -16px);
        }

        & .cta:after {
            position: absolute;
            content: '';
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;

            background-color: transparent;
            transform: translate(0, -4px);
        }
    }


    .tooltip {
        width: max-content;
        position: absolute;
        top: 0;
        left: 0;
        font-weight: bold;
        font-size: 90%;
    }

    .tooltip > div {
        background: #222;
        color: white;
        border-radius: 2px;
        padding: 0.05rem 0.3rem;
        margin-bottom: 0.6rem;
        border: 1px solid white;
        font-size: 0.85rem;
        font-weight: normal;
    }
</style>