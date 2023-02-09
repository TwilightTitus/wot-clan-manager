import Application from "../Application.js";

Application.use(async (request, response, next) => {
	const {baseUrl,  originalUrl, hostname, path, session } = request;
	console.log({ baseUrl, originalUrl, hostname, path, member: session.member, accessToken: session.accessToken });
	await next();
});
