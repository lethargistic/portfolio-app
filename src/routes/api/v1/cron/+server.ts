import {fail, type RequestHandler} from "@sveltejs/kit";
import {SECRET_CRON} from "$env/static/private";
import {PUBLIC_OTY_API_KEY, PUBLIC_OTY_URL} from "$env/static/public";

export const GET: RequestHandler = async ({request: req, locals: {supabase}}) => {
    if (req.headers.get('Authorization') !== `Bearer ${SECRET_CRON}`) {
        fail(401, 'Beware the geese you weirdly explicitly not fiend actually');
    }

    // i don't think it needs to be that complicated but last time
    // i did this it was wonky so what do i know
    //
    // i am a pirate arr
    const dayOfMonth = new Date().getDate();
    const shouldRun = dayOfMonth <= 3 || Math.floor(dayOfMonth / 2) % 2 === 0;

    if (!shouldRun) {
        console.log('Skipping cronin this time');
        return new Response('skipped');
    }

    const {data: _d, error: sberr} = await supabase
        .from('socials')
        .select()

    if (sberr) {
        console.error(sberr);
        fail(500, sberr)
    }

    // TODO: move to ohthatsuseful proper
    const _ = await fetch(`${PUBLIC_OTY_URL}/rest/v1/nifties?select=*&limit=1`, {
        method: 'GET',
        headers: {
            'apikey': PUBLIC_OTY_API_KEY,
            'Authorization': `Bearer ${PUBLIC_OTY_API_KEY}`
        }
    })

    console.log(_,'Keeping alive!')

    return new Response('i am cronin');
}