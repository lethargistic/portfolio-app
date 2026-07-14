import type {PageServerLoad} from "./$types";
import {getImageGallery} from "$lib/galleries/gallleries";
import {SECRET_MC_KEY} from "$env/static/private";

export const load: PageServerLoad = async ({url}) => {
    return await getImageGallery('mc', url, SECRET_MC_KEY);
}

