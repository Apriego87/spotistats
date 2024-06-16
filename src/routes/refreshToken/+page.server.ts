import { redirect } from "@sveltejs/kit"
import type { PageServerLoad } from "../$types"
import { env } from "$env/dynamic/private";

export const load: PageServerLoad = async ({ url }) => {
    var refresh_token = url.searchParams.get('refresh_token');

    console.log(refresh_token)

    const authString = btoa(`${env.client_id}:${env.client_secret}`);
    const params = new URLSearchParams();

    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', refresh_token);

    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${authString}`,
        },
        body: params.toString(),
    });

    if (response.ok) {
        const body = await response.json();
        const access_token = body.access_token;
        const now = new Date()
        const expires = new Date(now.getTime() + body.expires_in * 1000)

        return {
            access_token: access_token, expires: expires
        };
    } else {
        throw new Error('ha habido un error');
    }

    /* var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
        },
        form: {
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        },
        json: true
    };

    request.post(authOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var access_token = body.access_token,
                refresh_token = body.refresh_token;
            res.send({
                'access_token': access_token,
                'refresh_token': refresh_token
            });
        }
    }); */
}