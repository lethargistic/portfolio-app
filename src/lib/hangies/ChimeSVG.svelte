<script lang="ts">
    let {foldCount, trackedGroup = $bindable(null), cutout} = $props();
    const FILL_OPACITY = "0.01";
    const FILL_COLOR = "#eaeaea";

    $inspect('cut', cutout, foldCount)
</script>

{#if foldCount >= 4}
    <path id="4r" d="M526.124 1224.68L351.469 1399.33L176.813 1224.68L351.469 1050.02L526.124 1224.68Z" fill={FILL_COLOR}
          fill-opacity={cutout ? "1" : FILL_OPACITY} stroke="black" stroke-width="3"/>
    <path id="4rup" d="M526.116 1224.68L351.461 1399.33L176.806 1224.68L351.461 1050.02L526.116 1224.68Z" fill={FILL_COLOR}
          fill-opacity={cutout ? "1" : FILL_OPACITY} stroke="black" stroke-width="3"/>
{/if}
{#if foldCount >= 3}
    <path id="3r" d="M526.12 875.377L351.465 1050.03L176.809 875.377L351.465 700.721L526.12 875.377Z" fill={FILL_COLOR}
          fill-opacity={cutout ? "1" : FILL_OPACITY} stroke="black" stroke-width="3"/>
    <path id="3rup" d="M526.112 875.377L351.457 1050.03L176.802 875.377L351.457 700.721L526.112 875.377Z" fill={FILL_COLOR}
          fill-opacity={cutout ? "1" : FILL_OPACITY} stroke="black" stroke-width="3"/>
{/if}
{#if foldCount >= 2}
    <path id="2r" d="M526.105 526.077L351.449 700.732L176.794 526.077L351.449 351.421L526.105 526.077Z" fill={FILL_COLOR}
          fill-opacity={cutout ? "1" : FILL_OPACITY} stroke="black" stroke-width="3"/>
    <path id="2rup" d="M526.116 526.077L351.461 700.732L176.806 526.077L351.461 351.421L526.116 526.077Z" fill={FILL_COLOR}
          fill-opacity={cutout ? "1" : FILL_OPACITY} stroke="black" stroke-width="3"/>
{/if}
{#if foldCount >= 1}
    {#snippet trackedPaths()}
        <path id="1r" d="M526.108 176.777L351.453 351.432L176.798 176.777L351.453 2.12132L526.108 176.777Z"
              fill={FILL_COLOR} fill-opacity={cutout ? "1" : FILL_OPACITY} stroke="black" stroke-width="3"/>
        <path id="1rup" d="M526.105 176.777L351.449 351.432L176.794 176.777L351.449 2.12132L526.105 176.777Z"
              fill={FILL_COLOR} fill-opacity={cutout ? "1" : FILL_OPACITY} stroke="black" stroke-width="3"/>
        <path id="1l" d="M351.437 351.427L176.781 526.082L2.12588 351.427L176.781 176.771L351.437 351.427Z"
              fill={FILL_COLOR} fill-opacity={cutout ? "1" : FILL_OPACITY} stroke="black" stroke-width="3"/>
        <path id="1lup" d="M351.437 351.427L176.781 526.082L2.12588 351.427L176.781 176.771L351.437 351.427Z"
              fill={FILL_COLOR} fill-opacity={cutout ? "1" : FILL_OPACITY} stroke="black" stroke-width="3"/>
    {/snippet}
    {#if cutout}
        <g>
            {@render trackedPaths()}
        </g>
    {:else}
        <g bind:this={trackedGroup}>
            {@render trackedPaths()}
        </g>
    {/if}
{/if}
{#if foldCount >= 4}
    <path id="4l" d="M351.433 1399.33L176.777 1573.98L2.12197 1399.33L176.777 1224.67L351.433 1399.33Z" fill={FILL_COLOR}
          fill-opacity={cutout ? "1" : FILL_OPACITY} stroke="black" stroke-width="3"/>
    <path id="4lup" d="M351.437 1399.33L176.781 1573.98L2.12588 1399.33L176.781 1224.67L351.437 1399.33Z" fill={FILL_COLOR}
          fill-opacity={cutout ? "1" : FILL_OPACITY} stroke="black" stroke-width="3"/>
{/if}
{#if foldCount >= 3}
    <path id="3l" d="M351.433 1050.03L176.777 1224.68L2.12197 1050.03L176.777 875.371L351.433 1050.03Z" fill={FILL_COLOR}
          fill-opacity={cutout ? "1" : FILL_OPACITY} stroke="black" stroke-width="3"/>
    <path id="3lup" d="M351.437 1050.03L176.781 1224.68L2.12588 1050.03L176.781 875.371L351.437 1050.03Z" fill={FILL_COLOR}
          fill-opacity={cutout ? "1" : FILL_OPACITY} stroke="black" stroke-width="3"/>
{/if}
{#if foldCount >= 2}
    <path id="2l" d="M351.437 700.727L176.781 875.382L2.12588 700.727L176.781 526.071L351.437 700.727Z" fill={FILL_COLOR}
          fill-opacity={cutout ? "1" : FILL_OPACITY} stroke="black" stroke-width="3"/>
    <path id="2lup" d="M351.441 700.727L176.785 875.382L2.12978 700.727L176.785 526.071L351.441 700.727Z" fill={FILL_COLOR}
          fill-opacity={cutout ? "1" : FILL_OPACITY} stroke="black" stroke-width="3"/>
{/if}