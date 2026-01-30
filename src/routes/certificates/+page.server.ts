import type {PageServerLoad} from "./$types";
import {getAdminClient} from "$lib/serverUtils/getSupabaseAdminClient";

export const load: PageServerLoad = async () => {
    const supabase = await getAdminClient();



    // TODO: cert from db
}