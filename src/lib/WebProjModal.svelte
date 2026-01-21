<script>
    import {modal} from "$lib/shared.svelte";

    const {selectedDetails: details} = $props();
</script>

{#if !!details && modal.open}
    <div class="modal">
        <div class="arrows">
            &lt;-- / --&gt;
        </div>
        <div class="dialog" style={`justify-content: ${modal.left ? 'flex-start' : 'flex-end'};`}>
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

            & img {
                height: 20%;
                aspect-ratio: 16/9;
            }

        }

        & .arrows {
            position: absolute;
            right: 15px;
            top: 10px;
            z-index: 1001;
        }
    }
</style>