import type {Actions, PageServerLoad} from "./$types";
import {fail, redirect} from "@sveltejs/kit";

export const load: PageServerLoad = async ({url, locals: {safeGetSession}}) => {
    const {session} = await safeGetSession()

    if (session) redirect(303, '/');

    return {url: url.origin}
}

export const actions: Actions = {
    default: async (e) => {
        const {
            request,
            locals: {supabase}
        } = e
        const formData = await request.formData();
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const isValidEmail = /^[\w-\.+]+@([\w-]+\.)+[\w-]{2,8}$/.test(email)

        if (!isValidEmail) {
            return fail(400, {
                errors: {email: "You can't even enter a valid email??? The geese get closer angrily"},
                email
            });
        }
        console.log(email);
        const {error} = await supabase.auth.signInWithPassword({email, password});

        if (error) {
            return fail(400, {
                success: false,
                email,
                message: 'Nope'
            })
        }

        return {
            success: true,
            message: 'The magic link sure has appeared in your inbox. We hope it\'s you the void one. Geese wait in anticipation.'
        }
    }
}