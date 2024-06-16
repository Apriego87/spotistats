import type { PageServerLoad } from "./$types";
import { env } from "$env/dynamic/private";

export const load: PageServerLoad = async () => {
    const clientID = env.client_id
    const redirectURI = env.redirect_uri

    return {
        clientID, redirectURI
    }
}