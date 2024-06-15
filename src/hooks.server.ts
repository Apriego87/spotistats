export async function handle({ event, resolve }) {
    const accessToken = event.cookies.get('access_token');
    if (accessToken) {
        event.locals.access_token = accessToken;
    }
    const response = await resolve(event);
    return response;
}
