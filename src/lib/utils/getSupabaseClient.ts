import {PUBLIC_SUPABASE_API_KEY, PUBLIC_SUPABASE_URL} from "$env/static/public";
import {createClient} from "@supabase/supabase-js";

let supabaseAny: any | null = null;
export const getClient = () => {
    if (!supabaseAny) {
        supabaseAny = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_API_KEY);
    }

    return supabaseAny;
}