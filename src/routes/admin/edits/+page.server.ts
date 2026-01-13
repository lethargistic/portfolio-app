import type {Actions} from "./$types";
import {fail} from "@sveltejs/kit";

export const actions = {
    postSocial: async ({ locals: {supabase, safeGetSession}, request }) => {
        const { session, user } = await safeGetSession();

        if (!session || !user) {
            console.warn(`Unauthorized data submission attempt!!!, ${Date.now()}`)
            return fail(401, { success: false, message: "Who are you? The geese will get you, soon enough. Run." })
        }

        const social = await request.formData();
        console.log(session, user);
        console.log(social);

        return {success: true, message: "Posted! Now double check or else."}
    }
} satisfies Actions