import type {PageServerLoad} from "./$types";
import {getAdminClient} from "$lib/serverUtils/getSupabaseAdminClient";
import {SECRET_CERT_KEY} from "$env/static/private";
import {error, redirect} from "@sveltejs/kit";
import {PUBLIC_DEV} from "$env/static/public";

export const load: PageServerLoad = async ({url}) => {
    const key = url.searchParams.get('key');

    if (key !== SECRET_CERT_KEY) {
        redirect(303, '/');
    }

    const supabase = await getAdminClient();

    const {data: files, error: listError} = await supabase
        .storage
        .from('cert')
        .list('', {
            offset: 0,
        })

    if (!files || listError) {
        if (PUBLIC_DEV) {
            console.error('No list', listError);
        }

        error(500, 'Failed to get certificates');
    }

    const signedUrls = await Promise.all(
        files.map(async (file: Record<string, any>) => {
            const {data, error: inerr} = await supabase
                .storage
                .from('cert')
                .createSignedUrl(file.name, 3600)

            if (!data || inerr) {
                console.error('Failed to get link', inerr);
                error(500, 'Failed to get certificates');
            }

            return {
                name: file.name,
                src: data.signedUrl
            }
        })
    )

    return {signedUrls};
}