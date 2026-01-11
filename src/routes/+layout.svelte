<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '../styles/global.css';
    import {onMount} from "svelte";
    import {invalidate} from "$app/navigation";
    import {editing, editorMode, fiend} from "$lib/shared.svelte";

	let { data, children } = $props();
    let { supabase, session } = $derived(data);

    onMount(() => {
        const { data } = supabase.auth.onAuthStateChange((_e, _session) => {
            if (_session?.expires_at !== session?.expires_at) {
                invalidate('supabase:auth')
            }
        });

        return () => data.subscription.unsubscribe();
    })

    $effect(() => {fiend.state = !!session;})

    const handleEditModeSwitch = (e: KeyboardEvent) => {
        if (e.key === 'e' && fiend.state) {
            editorMode.state = !editorMode.state;
        }
        if (e.key === 'Escape' && fiend.state) {
            editing.state = false;
        }
    }
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>
<svelte:window onkeydown={handleEditModeSwitch}></svelte:window>

{@render children()}
