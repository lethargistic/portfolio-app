<script lang="ts">
    import {modal} from "$lib/shared.svelte";
    import Icon from "$lib/Icon.svelte";

    const {selectedDetails: details} = $props();

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
</script>

{#if !!details && modal.open}
    <div style={`justify-content: ${modal.left ? 'flex-start' : 'flex-end'};`}
         class="modal" onclick={handleModalCloseCheck} onkeydown={handleModalCloseCheck}
         role="button" tabindex="-1">
        <div bind:this={controls} class="controls">
            <div class="arrows">
                &lt;-- / --&gt;
            </div>
            <button class="cross" onclick={closeModal}>
                <Icon name={'cross'} width={24} height={24} currentColor={'#fff'}/>
            </button>
        </div>
        <div bind:this={dialog} class="dialog">
            <img src={details.img} alt={details.display_name}/>
            <div class="info">
                <h2>{details.display_name}</h2>
                <div class="separator">~~~~~~~~~</div>
                <p class="desc">{details.long_desc}</p>
            </div>
        </div>
    </div>
{/if}

<style>
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(16, 16, 16, 0.7);
        z-index: 1000;

        color: white;
        display: flex;
        align-items: center;

        & .dialog {
            width: 50%;
            height: 100%;

            display: flex;
            align-items: center;

            /* so it's click-throughable */
            pointer-events: none;
            & * {
                pointer-events: initial;
            }

            & img {
                height: 20%;
                aspect-ratio: 16/9;
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

            & .cross {
                all: unset;
                cursor: pointer;
                margin-left: auto;
                margin-right: 2rem;
            }

            & .arrows {
                margin-left: 1rem;
            }
        }
    }
</style>