import type {Handle} from '@sveltejs/kit';
import {paraglideMiddleware} from '$lib/paraglide/server';
import {createServerClient} from "@supabase/ssr";
import {PUBLIC_SUPABASE_API_KEY, PUBLIC_SUPABASE_URL} from "$env/static/public";
import {sequence} from "@sveltejs/kit/hooks";

export const handleAuth: Handle = async ({event: e, resolve}) => {
    e.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_API_KEY, {
        cookies: {
            getAll: () => e.cookies.getAll(),
            setAll: (cookiesToSet) => {
                cookiesToSet.forEach(({name, value, options}) => {
                    e.cookies.set(name, value, {...options, path: '/'})
                })
            },
        },
    })

    e.locals.safeGetSession = async () => {
        const {data: {user}, error} = await e.locals.supabase.auth.getUser();
        if (error) return {session: null, user: null};

        const {data: {session}} = await e.locals.supabase.auth.getSession();
        return {session, user}
    }

    return resolve(e, {
        filterSerializedResponseHeaders(name: string) {
            return name === 'content-range' || name === 'x-supabase-api-version'
        }
    })
}

const handleParaglide: Handle = ({event, resolve}) => paraglideMiddleware(event.request, ({request, locale}) => {
    event.request = request;

    return resolve(event, {
        transformPageChunk: ({html}) => html.replace('%paraglide.lang%', locale)
    });
});

export const handle: Handle = sequence(handleAuth, handleParaglide);
