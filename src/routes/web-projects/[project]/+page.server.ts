import type {PageServerLoad} from "./$types";
import {error} from "@sveltejs/kit";

export const load: PageServerLoad = async ({params, locals: {supabase}}) => {
    const {data, error: sberr} = await supabase
        .from('web_projects_details')
        .select()
        .eq('name', params.project)
        .limit(1)
        .single()

    if (sberr || !data) error(500, `Failed to load project: ${sberr?.message}`)

    return data;
}