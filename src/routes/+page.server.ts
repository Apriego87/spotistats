import type { PageServerLoad } from "./$types";
import { env } from "$env/dynamic/private";

export const load: PageServerLoad = async () => {
    const clientID = env.client_id

    return {
        clientID
    }
}