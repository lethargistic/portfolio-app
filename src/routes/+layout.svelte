<script lang="ts">
    import favicon from '$lib/assets/favicon.svg';
    import '../styles/global.css';
    import {onMount} from "svelte";
    import {invalidate} from "$app/navigation";
    import {editing, fiend, editbar, settings} from "$lib/shared.svelte";

    let {data, children} = $props();
    let {supabase, session} = $derived(data);

    onMount(() => {
        const {data} = supabase.auth.onAuthStateChange((_e, _session) => {
            if (_session?.expires_at !== session?.expires_at) {
                invalidate('supabase:auth')
            }
        });

        return () => data.subscription.unsubscribe();
    })

    $effect(() => {
        fiend.state = !!session;
    })

    const handleEditModeSwitch = (e: KeyboardEvent) => {
        const target = e.target as HTMLElement;
        const isTyping =
            target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.isContentEditable;

        if (isTyping) return;

        if (e.key === 'e' && fiend.state) {
            settings.editor.state = !settings.editor.state;
        }
        if (e.key === 'Escape' && fiend.state) {
            editing.state = false;
        }
        if (e.key === 's' && editing.state && fiend.state) {
            editbar.open = !editbar.open;
        }
    }
</script>

<svelte:head>
    <link rel="icon" href={favicon}/>
</svelte:head>
<svelte:window onkeydown={handleEditModeSwitch}></svelte:window>

{@render children()}
