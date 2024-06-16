import { fetchToken } from '$lib/auth'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url }) => {
    const code = url.searchParams.get('code')
    console.log(code)

    if (code) {
        const tokenResponse = await fetchToken(code)
        if (tokenResponse.access_token) {

            const now = new Date()
            const expiry = new Date(now.getTime() + tokenResponse.expires_in * 1000)
            return {
                access_token: tokenResponse.access_token, refresh_token: tokenResponse.refresh_token, expires_in: tokenResponse.expires_in, expires: expiry
            }
        }
    } else {
        return {
            message: 'no detecta el code'
        }
    }
    return {
        code
    }
}