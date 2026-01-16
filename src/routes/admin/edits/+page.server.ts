import type {Actions} from "./$types";
import {fail} from "@sveltejs/kit";
import {PUBLIC_DEV} from "$env/static/public";
import {getAdminClient} from "$lib/serverUtils/getSupabaseAdminClient";
import {convertSimpleDataTypesImplicitly} from '$lib/utils/utils';

export const actions = {
    postSocial: async ({locals: {safeGetSession}, request}) => {
        const {session, user} = await safeGetSession();

        if (!session || !user) {
            console.warn(`Unauthorized data submission attempt!!!, ${Date.now()}`)
            return fail(401, {success: false, message: "Who are you? The geese will get you, soon enough. Run."})
        }

        const data = await request.formData();
        const social = Object.fromEntries(data.entries());
        const foldsJSON = JSON.parse(social.folds as string)

        const folds: Array<typeof foldsJSON[any]> = [];

        // should come pre-converted from inputs anyway
        for (const obj of foldsJSON) {
            const newObj: Record<string, any> = {};
            for (let [key, value] of Object.entries(obj)) {
                newObj[key] = key.startsWith('type_') ? value : convertSimpleDataTypesImplicitly(value);
            }
            folds.push(newObj);
        }

        delete social.folds;
        const supabase = getAdminClient();

        // will be replaced/added if upsert
        delete social.id;
        delete social.created_at;

        // most types implicitly, supabase eats them just fine
        const { error: sberr } = await supabase
            .from('socials')
            .upsert(
                { folds, ...social},
                { onConflict: 'name' })

        if (sberr) {
            if (PUBLIC_DEV) {console.error(sberr)}
            return fail(400, { success: false, message: "Db fail" })
        }

        return {success: true, message: "Posted! Now double check or else."}
    },
    deleteSocial: async ({locals: {safeGetSession}, request}) => {
        const {session, user} = await safeGetSession();

        if (!session || !user) {
            console.warn(`Unauthorized data submission attempt!!!, ${Date.now()}`)
            return fail(401, {success: false, message: "Who are you? The geese will get you, soon enough. Run."})
        }

        const data = await request.formData();
        const social = Object.fromEntries(data.entries());

        const supabase = getAdminClient();
        const { error: sberr } = await supabase
            .from('socials')
            .delete()
            .eq('name', social.name)

        if (sberr) {
            if (PUBLIC_DEV) {console.error(sberr)}
            return fail(400, { success: false, message: "Db fail" })
        }

        return {success: true, message: "Deleted!", toDelete: social.name}
    }
} satisfies Actions