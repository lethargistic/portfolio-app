<script lang="ts">
    // most icons sourced from https://lucide.dev/, thanks!
    // brand icons form https://simpleicons.org/,
    // https://icons.getbootstrap.com/ for microsoft icons.

    // in px

    import icons from "$lib/icons/icons";

    let {name, width = 24, height = 24, currentColor = "#111111"} = $props();
</script>

<div class="factory-icon"
     style={`--current-color: ${currentColor}; --factory-width: ${width}px; --factory-height: ${height}px;`}>
    {@html icons[name] || icons['fallback']}
</div>

<style>
    :global {
        .factory-icon {
            /* changed in js */
            --current-color: '#111111';
            --factory-width: 24px;
            --factory-height: 24px;

            & svg, img {
                color: var(--current-color);
                width: var(--factory-width);
                height: var(--factory-height);
            }
        }
    }
</style>