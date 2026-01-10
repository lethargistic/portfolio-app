import type {LayoutLoad} from "./$types";
import {createBrowserClient, createServerClient, isBrowser} from "@supabase/ssr";
import {PUBLIC_SUPABASE_API_KEY, PUBLIC_SUPABASE_URL} from "$env/static/public";

export const load: LayoutLoad = async ({ fetch, data, depends }) => {
    depends('supabase:auth');

    const supabase = isBrowser()
    ? createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_API_KEY, {
        global: {fetch}
    })
        : createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_API_KEY, {
            global: {fetch},
            cookies: {
                getAll() {return data.cookies}
            }
        })

    const { data: { session } } = await supabase.auth.getSession();

    return { supabase, session }
}