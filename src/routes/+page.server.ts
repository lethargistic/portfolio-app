import {error} from "@sveltejs/kit";
import type {PageServerLoad} from "./$types";
import {getAdminClient} from "$lib/serverUtils/getSupabaseAdminClient";

export const prerender = true;

export const load: PageServerLoad = async () => {
    const supabase = await getAdminClient();

    const {data: socials, error: sberr} = await supabase
        .from('socials')
        .select()
        .order('id', { ascending: true })
    if (sberr || !socials) error(500, `Failed to load socials: ${sberr?.message}`);

    // sort of a dumb way to do it but i don't want to fiddle with the added infrastructure by
    // making an example fold in the db and having to filter out right now
    const firstFold = socials[0].folds[0];
    const firstFoldEntries = Object.entries(firstFold);
    let update = false;
    for (let social of socials) {
        for (let fold of social.folds) {
            for (const [key, value] of firstFoldEntries) {
                if (fold[key] === undefined) {
                    update = true;
                    fold[key] = value;
                }
            }
        }
    }

    if (update) {
        for (let social of socials) {
            const {error: sbwerr} = await supabase
                .from('socials')
                .update({folds: social.folds})
                .eq('name', social.name)
                .limit(1)

            if (sbwerr) error(500, `Failed to update socials: ${sbwerr?.message}`);
        }
    }

    const {data: web_projects, error: wberr} = await supabase
        .from('web_projects')
        .select()
        .order('id', {ascending: true})
    if (wberr || !web_projects) error(500, `Failed to load socials ${wberr.message}`);

    //

    const {data: web_projects_details, error: sbwerr} = await supabase
        .from('web_projects_details')
        .select()

    if (sbwerr || !web_projects_details) error(500, `Failed to load web project details: ${sberr?.message}`)

    return {socials, web_projects, web_projects_details};
}