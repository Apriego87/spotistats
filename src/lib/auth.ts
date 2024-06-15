export async function fetchToken(code) {
    const clientId = 'a8424c358de44bfc9a1a344985cc703a';
    const clientSecret = '1c1b318e39ae444d906f01d7c2e36f41';
    const redirectUri = 'http://localhost:5173/callback';

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
