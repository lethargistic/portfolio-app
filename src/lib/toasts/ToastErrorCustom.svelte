<script lang="ts">
    import {onMount} from "svelte";

    let {text, toast} = $props();

    onMount(() => {
        toast.type = 'error';
    })
</script>

<div class="toast">
    <p>{text}</p>
</div>

<style>
    .toast {
        padding-left: 1rem;
    }
</style>