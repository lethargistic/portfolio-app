import {error, redirect} from "@sveltejs/kit";
import {getAdminClient} from "$lib/serverUtils/getSupabaseAdminClient";
import {PUBLIC_DEV} from "$env/static/public";

export const getImageGallery = async (bucket: string, url: URL, viewKey: string) => {
    const key = url.searchParams.get('key');

    if (key !== viewKey && viewKey != 'pass') {
        redirect(303, '/');
    }

    const supabase = await getAdminClient();

    const {data: files, error: listError} = await supabase
        .storage
        .from(bucket)
        .list('', {
            offset: 0,
        })

    if (!files || listError) {
        if (PUBLIC_DEV) {
            console.error('No list', listError);
        }

        error(500, 'Failed to get images');
    }

    const signedUrls = await Promise.all(
        files.map(async (file: Record<string, any>) => {
            const {data, error: inerr} = await supabase
                .storage
                .from(bucket)
                .createSignedUrl(file.name, 3600)

            if (!data || inerr) {
                console.error('Failed to get link', inerr);
                error(500, 'Failed to get images');
            }

            return {
                name: file.name,
                src: data.signedUrl
            }
        })
    )

    return {signedUrls};
}