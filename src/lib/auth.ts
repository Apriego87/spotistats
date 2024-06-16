import { env } from "$env/dynamic/private";

export async function fetchToken(code) {
    const clientId = env.client_id;
    const clientSecret = env.client_secret;
    const redirectUri = env.redirect_uri;

    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(`${clientId}:${clientSecret}`)
        },
        body: new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: redirectUri
        })
    });

    return await response.json();
}
