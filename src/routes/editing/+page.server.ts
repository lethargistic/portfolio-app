import type {PageServerLoad} from "./$types";
import {getAdminClient} from "$lib/serverUtils/getSupabaseAdminClient";

export const load: PageServerLoad = async () => {
    const supabase = await getAdminClient();

    const {data, error} = await supabase
        .from('video_editing')
        .select('*')

    if (!data || error) {
        console.error('Failed to get video', error);
        error(500, 'Failed to get video');
    }

    const parsedData = [];
    for (const video of data) {
        parsedData.push({name: video.category, src: video.link, order: video.order})
    }

    parsedData.sort((a, b) => {
        if (a.order == null && b.order == null) return 0;
        if (a.order == null) return 1;
        if (b.order == null) return -1;
        return a.order - b.order;
    });

    const signedUrls = parsedData.map(({order, ...rest}) => rest);

    return { signedUrls };
}