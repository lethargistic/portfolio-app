import {fail, type RequestHandler} from "@sveltejs/kit";
import {SECRET_CRON} from "$env/static/private";

export const GET: RequestHandler = ({request: req}) => {
    if (req.headers.get('Authorization') !== `Bearer ${SECRET_CRON}`) {
        fail(401, 'Beware the geese you weirdly explicitly not fiend actually');
    }

    return new Response('i am cronin');
}