// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
        interface Locals {
            supabase: SupabaseClient
            safeGetSession(): Promise<{ session: Session | null; user?: Session["user"] | null }>
        }
        interface PageData {
            session: Session | null
            user?: Session["user"] | null
        }
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
