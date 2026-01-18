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
                    socials[socials.findIndex((s: typeof social) => s.name === social.name)]
                        .folds[social.folds.findIndex((f: typeof fold) => f.slug === fold.slug)][key] = value;
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

    return {socials};
}