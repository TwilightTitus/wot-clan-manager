const HEADER_AUTHORIZATION = "Authorization";

export const autorizationToken = (request) => {
    let token = request.get(HEADER_AUTHORIZATION);
    if (!token) return null;

    token = /Bearer (.+)/gi.exec(token)[1];
    if (!token) return null;

    return token;
}