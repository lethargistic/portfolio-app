import {createClient} from "@supabase/supabase-js";
import {PUBLIC_SUPABASE_URL} from "$env/static/public";
import {SECRET_SUPABASE_API_KEY} from "$env/static/private";

let supabaseAny: any | null = null;
export const getAdminClient = () => {
    if (!supabaseAny) {
        supabaseAny = createClient(PUBLIC_SUPABASE_URL, SECRET_SUPABASE_API_KEY);
    }

    return supabaseAny;
}
