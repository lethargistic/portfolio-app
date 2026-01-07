import {getClient} from "$lib/utils/supabaseClientGetters";
import {error} from "@sveltejs/kit";

export const prerender = true;

export const load = async () => {
    const supabase = await getClient();

    const {data: socials, error: sberr} = await supabase
        .from('socials')
        .select()
    if (sberr || !socials) error(500, `Failed to load socials: ${sberr?.message}`);

    return {socials};
 }