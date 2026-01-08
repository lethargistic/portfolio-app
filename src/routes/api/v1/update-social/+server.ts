import {error, type RequestHandler} from "@sveltejs/kit";
import {getAdminClient} from "$lib/serverUtils/getSupabaseAdminClient";
import * as fetchers from '$lib/serverUtils/socialStats';
import {getRedis} from "$lib/serverUtils/getRedis";

const checkRateLimit = async (id: string) => {
    const redis = getRedis();

    const key = `ratelimit:${id}`;
    const requests = await redis.incr(key);

    if (requests === 1) {
        await redis.expire(key, 60);
    }

    return requests <= 30;
}

export const POST: RequestHandler = async ({ request, getClientAddress }) => {
    if (!await checkRateLimit(getClientAddress())) error(429, 'Touch grass.');

    const socialJSON = await request.json();
    const social = socialJSON.social;
    if (!social) error(400, 'Your arg is a figment of your imagination.');

    // is this more complicated than making a map? - a little bit yes
    // did i want to make it scalable for no reason whatsoever other than it's cool - also a little bit yes
    const pascalize = (str: string) => str
        .split('-')
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');

    const validFunctions = Object.keys(fetchers);

    const funcName = `fetch${pascalize(social)}Folds`;
    if (!validFunctions.includes(funcName)) error(400, `The api ate a ${social} and it didn't taste good. Call an ambulance!`);

    const fetchFunc = (fetchers as any)[funcName]
    const freshFolds = await fetchFunc();

    const supabase = getAdminClient();
    const {data, error: folderr} = await supabase
        .from('socials')
        .select('folds')
        .eq('name', social)
        .limit(1)
        .single()

    if (!data || folderr) error(500, `Failed to update socials: ${folderr?.message}`);

    const folds = data.folds;

    for (const [title, state] of Object.entries(freshFolds)) {
        // if bork fallback to db value
        if (!state) continue;

        folds[folds.findIndex((fold: typeof folds[number]) => fold.title === title)].state = state;
    }


    const {error: upderr} = await supabase
        .from('socials')
        .update({folds: folds})
        .eq('name', social)
        .limit(1)

    if (upderr) error(500, `Failed to update socials: ${upderr?.message}`);

    return new Response(JSON.stringify(folds), {
        headers: { "Content-Type": "application/json" }
    });
}