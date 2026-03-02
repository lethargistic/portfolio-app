<script lang="ts">
    import {
        activeEditor,
        editing,
        hackeryTextAnim,
        handleItemEdit,
        modal, deviceMin, t, currentLang, editbar
    } from "$lib/shared.svelte";
    import Icon from "$lib/Icon.svelte";
    import {blur} from "svelte/transition";
    import {expoIn, expoOut, cubicInOut} from "svelte/easing";
    import EditorTools from "$lib/editing/EditorTools.svelte";
    import {untrack} from "svelte";

    let owner = $derived(modal.owner);
    let details = $derived(owner === 'web' ? modal.selectedValDetails : modal.selectedVal);
    let proj = $derived(owner === 'web' ? modal.selectedVal : modal.selectedVal);
    let allDetails = $derived(owner === 'web' ? editbar.proj_details_data : editbar.other_data);

    let isWeb = $derived(owner === 'web');
    let isOther = $derived(owner === 'other');

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
        modal.selectedIx = newIx;
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

    let longDesc = $derived(details ? details[`long_desc_${currentLang.lang}`] : '');

    let displayName = $derived(proj && proj?.owner === owner ? t[`${owner}_card_${(proj.name).replaceAll('-', '_')}_display`]() : '');
    let cleanupH: (() => void) | null = null;
    let cleanupDesc: (() => void) | null = null;
    let isOpen = $derived(!!details && modal.open);
    $effect(() => {
        if (details) {
            if (displayName && longDesc) {
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

                cleanupH = hackeryTextAnim(hElem, 0.4, displayName);
                cleanupDesc = hackeryTextAnim(descElem, 6, longDesc);
            })
        }
    })
</script>

{#if isOpen}
    <div transition:blur={{duration: modal.open ? 500 : 400, easing: modal.open ? expoIn : expoOut}}
         style={`justify-content: ${modal.left || deviceMin.mobile ? 'flex-start' : 'flex-end'};`}
         class={`modal ${isWeb ? 'modal-web' : 'modal-other'}`} onclick={handleModalCloseCheck}
         onkeydown={handleModalCloseCheck}
         role="button" tabindex="-1">
        <div bind:this={controls} class="controls">
            <div class="arrows">
                <button onclick={() => rotateSelected(false)}>&lt;--</button>
                /
                <button onclick={() => rotateSelected(true)}>--&gt;</button>
                <EditorTools seg={isWeb ? 'wb-inn' :
                 isOther ? 'other' : null} light={true}/>
            </div>

            <button class="cross" onclick={closeModal}>
                {#if isWeb}
                    <Icon name={'cross'} width={24} height={24} currentColor={'#fff'}/>
                {:else if isOther}
                    <img src="/img/icons/pixel-cross.webp" alt="exit modal (pixelated)">
                {:else}
                    oh no
                {/if}
            </button>
        </div>
        <div bind:this={dialog} class={`dialog ${modal.left ? 'dialog-left' : 'dialog-right'}`}>
            <div
                    onclick={handleDetailsInteraction}
                    onkeydown={handleDetailsInteraction}
                    role="button"
                    tabindex="-1"
                    class={`info ${activeEditor.state === 'wb-inn-modifying' ? 'hover-focus-light' : ''}`}>
                <h2 bind:this={hElem}>{displayName}</h2>
                <div class="separator">
                    {#each [...Array(27).keys()] as i}
                        {#if i === 0}={/if}=/
                    {/each}==
                </div>
                <div class="info-props">
                    {#if owner === 'web'}
                        <p class="num">#{proj?.read_num.toString().padStart(2, '0')}</p>
                    {/if}
                    <ul class="langs">
                        {t.web_modal_text_tech_used()}
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
                <p bind:this={descElem} class="desc">&nbsp;-> {longDesc}</p>
                <div class="button-wrap" style={`
                ${isOther ? `
                color: black;
                --shadowed-github-btn-color: #a4a3a6;
                --shadowed-link-btn-color: rgba(246, 245, 245, 0.7);
                --cta-github-hover-btn-color: #100e13;
                --cta-github-hover-before-btn-color: #0a060e;
                --cta-link-hover-btn-color: #f2f3fa;
                --cta-link-hover-before-btn-color: #3a1c5c;
                --cta-github-background-btn-color: #19141e;
                --cta-github-border-btn-color: #ecebf6;
                --cta-link-background-btn-color: #f7f6f8;
                --cta-link-border-btn-color: #353535;
                ` : ''}
                `}>
                    {#if details.link?.startsWith("modrinth-")}
                        <a href={details.link.replace("modrinth-","")}
                           class="cta cta-link cta-modrinth" target="_blank">
                            {@html t.web_modal_button_modrinth()}
                        </a>
                    {:else if details.link}
                        <a href={details.link} class="cta cta-link" target="_blank">
                            {@html t.web_modal_button_take_a_look()}
                        </a>
                    {/if}
                    {#if details.link_github}
                        <a href={details.link_github} class="cta cta-github" target="_blank">
                            {t.web_modal_button_github()}
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

    .modal-other {
        & * {
            font-family: 'Tiny5', monospace;
            font-size: 1.3rem;
        }

        & .dialog {
            & .info {
                & h2 {
                    font-family: Tiny5, monospace;
                    font-size: 3.5rem;
                }
            }
        }
    }

    .modal-web {
        & * {
            font-family: 'Fira Code', monospace;
        }

        & .dialog {
            & .info {
                & h2 {
                    font-family: 'Fira Code', monospace;
                    font-size: 2.5rem;
                }
            }
        }
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

        @media (max-width: 767px) {
            display: flex;
            align-items: end;
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

            @media (max-width: 767px) {
                width: 100%;
                box-sizing: border-box;
                padding: 0 1rem 0 1.5rem;
                height: 60%;
                margin: 0;
            }

            & * {
                pointer-events: initial;
            }

            & .info {
                display: grid;
                gap: 1rem;

                @media (max-width: 767px) {
                    width: 100%;
                    height: 100%;
                    overflow-y: auto;
                    overflow-x: hidden;
                    box-sizing: border-box;
                    padding-right: 0.5rem;
                    padding-bottom: 3rem;
                }

                & h2 {
                    font-weight: normal;

                    @media (max-width: 767px) {
                        width: 60%;
                    }
                }

                & .info-props {
                    display: flex;
                    align-items: center;
                    gap: 1rem;

                    @media (max-width: 767px) {
                        flex-direction: column;
                        align-items: initial;
                    }

                    & .num {
                        margin-top: 1px;
                    }

                    & .langs {
                        list-style: none;
                        display: flex;
                        align-items: center;
                        gap: 1rem;

                        @media (max-width: 767px) {
                            width: 57%;
                            flex-wrap: wrap;
                            padding-right: 0.5rem;
                        }

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

                    @media (max-width: 767px) {
                        width: 55%;
                    }
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

                & img {
                    width: 12px;
                    height: 12px;
                    image-rendering: pixelated;
                }
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

        /* TODO: make buttons data driven (why arent they??) */
        --cta-github-color: white;
        --cta-modrinth-color: #252527;
        --cta-modrinth-shadowed-text-color: #0b0c0b;
        --shadowed-github-btn-color: #1b1820;
        --shadowed-link-btn-color: #3e2471;
        --shadowed-modrinth-btn-color: #1e5936;
        --cta-github-hover-btn-color: #100e13;
        --cta-github-hover-before-btn-color: #0a060e;
        --cta-link-hover-btn-color: #6c35af;
        --cta-modrinth-hover-btn-color: #52ed96;
        --cta-link-hover-before-btn-color: #3a1c5c;
        --cta-github-background-btn-color: #19141e;
        --cta-github-border-btn-color: #4d2387;
        --cta-link-background-btn-color: #6728b3;
        --cta-link-border-btn-color: #3b225a;
        --cta-modrinth-background-btn-color: #43ec86;

        & .cta-github:before {
            background: var(--shadowed-github-btn-color);
            box-shadow: 0 0 0 1px var(--shadowed-github-btn-color);
        }

        & .cta-link:before {
            background: var(--shadowed-link-btn-color);
            box-shadow: 0 0 0 1px var(--shadowed-link-btn-color);
        }

        & .cta-modrinth:before {
            background: var(--shadowed-modrinth-btn-color);
            box-shadow: 0 0 0 1px var(--shadowed-modrinth-btn-color);
        }

        & .cta-github:hover {
            background-color: var(--cta-github-hover-btn-color);
        }

        & .cta-github:hover::before {
            box-shadow: 0 0 0 1px var(--cta-github-hover-before-btn-color);
        }

        & .cta-link:hover {
            background-color: var(--cta-link-hover-btn-color);
        }

        & .cta-link:hover::before {
            box-shadow: 0 0 0 1px var(--cta-link-hover-before-btn-color);
        }

        & .cta-github {
            all: unset;
            color: var(--cta-github-color);
            background-color: var(--cta-github-background-btn-color);
            border: 2px solid var(--cta-github-border-btn-color);
        }

        & .cta-link {
            all: unset;
            background-color: var(--cta-link-background-btn-color);
            border: 2px solid var(--cta-link-border-btn-color);
        }

        & .cta-modrinth {
            color: var(--cta-modrinth-color);
            background-color: var(--cta-modrinth-background-btn-color);
        }

        & .cta-modrinth:hover {
            color: var(--cta-modrinth-shadowed-text-color);
            background-color: var(--cta-modrinth-hover-btn-color);
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