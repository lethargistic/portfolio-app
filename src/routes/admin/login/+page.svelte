<script lang="ts">
    import { enhance } from "$app/forms";
    import type {SubmitFunction} from "@sveltejs/kit";
    let { data, form } = $props();

    let loading = $state(false);
    const handleSubmit: SubmitFunction = () => {
        loading = true
        return async ({ update }) => {
            update()
            loading = false;
        }
    }
</script>

<main>
    <pre>
        Sphinx of black quartz, judge my vow. <br>
        The guard geese are awaiting your input,
        And for false prophets... only doom awaits
        <em>*the geese stare at you with violence in their eyes*</em>
    </pre>
    <br>
    <p class="logged">Log status: {@html data.session ? '<span style="color: #3de68c">Logged in</span>' : '<span style="color: #e64a3d">Logged off</span>' } </p>
    <br>
    <form method="POST" use:enhance={handleSubmit}>
        <label>
            Email:
            <input name="email" placeholder="teadrinker238@gregmail.com" value={form?.email ?? ''}/>
        </label>
        <label>
            Password:
            <input name="password" type="password" placeholder="eggbiscuiT64_" value=''/>
        </label>
        <button>
            { loading ? 'loading...' : 'Login' }
        </button>
    </form>
    <br>
    {#if form?.message !== undefined}
        status: {form?.message}
    {/if}
    {#if form?.errors?.email !== undefined}
        status: {form?.errors?.email}
    {/if}
</main>

<style>
    main {
        width: 100vw;
        height: 100vh;
        color: white;
        background-color: #252525;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        & form {
            display: flex;
            flex-direction: column;

            margin-top: 2rem;

            gap: 1rem;
        }
    }

    .logged {
        font-weight: bold;
    }
</style>