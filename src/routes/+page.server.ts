import {error} from "@sveltejs/kit";
import type {PageServerLoad} from "./$types";

export const prerender = true;

export const load: PageServerLoad = async ({locals: { supabase }}) => {

    const {data: socials, error: sberr} = await supabase
        .from('socials')
        .select()
    if (sberr || !socials) error(500, `Failed to load socials: ${sberr?.message}`);

    return {socials};
 }