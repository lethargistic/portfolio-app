import type {Actions} from "./$types";
import {fail} from "@sveltejs/kit";
import {PUBLIC_DEV} from "$env/static/public";
import {getAdminClient} from "$lib/serverUtils/getSupabaseAdminClient";

const isValidNumber = (val: any) => {
    if (typeof val === 'boolean' || val === null || val === '') return false;
    return Number.isFinite(Number(val));
}


const convertSimpleObjTypesImplicitly = (obj: Record<string, any>) => {
    for (let [key, value] of Object.entries(obj)) {
        if (key.startsWith("type_") || typeof value !== 'string') continue;

        if (value === 'null') {
            obj[key] = null;
            continue;
        }
        if (value === 'undefined') {
            obj[key] = undefined;
            continue;
        }

        if (value === 'true' || value === 'false') {
            obj[key] = value === 'true'
            continue;
        }

        if (isValidNumber(value)) {
            obj[key] = Number(value);
        }
    }
    return obj;
}

export const actions = {
    postSocial: async ({locals: {safeGetSession}, request}) => {
        const {session, user} = await safeGetSession();

        if (!session || !user) {
            console.warn(`Unauthorized data submission attempt!!!, ${Date.now()}`)
            return fail(401, {success: false, message: "Who are you? The geese will get you, soon enough. Run."})
        }

        const data = await request.formData();
        const social = Object.fromEntries(data.entries());
        const folds = JSON.parse(social.folds as string).map((obj: Record<string, any>) => convertSimpleObjTypesImplicitly(obj));

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