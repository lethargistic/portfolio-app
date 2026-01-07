import {error, type RequestHandler} from "@sveltejs/kit";
import {fetchGithubFolds} from "$lib/serverUtils/socialStats";
import {getAdminClient} from "$lib/serverUtils/getSupabaseAdminClient";

export const GET: RequestHandler = async () => {
    const githubFolds = await fetchGithubFolds();

    const supabase = getAdminClient();
    const {data, error: folderr} = await supabase
        .from('socials')
        .select('folds')
        .eq('name', 'github')
        .limit(1)
        .single()


    if (!data || folderr) error(500, `Failed to update socials: ${folderr?.message}`);

    const folds = data.folds;

    for (const [title, state] of Object.entries(githubFolds)) {
        folds[folds.findIndex((fold: typeof folds[number]) => fold.title === title)].state = state;
    }

    const {error: upderr} = await supabase
        .from('socials')
        .update({folds: folds})
        .eq('name', 'github')
        .limit(1)

    if (upderr) error(500, `Failed to update socials: ${upderr?.message}`);

    return new Response(JSON.stringify(folds), {
        headers: { "Content-Type": "application/json" }
    });
}