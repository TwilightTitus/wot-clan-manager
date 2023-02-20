import Application from "../Application.js";

Application.use(async (request, response, next) => {
	const {originalUrl, session } = request;
	console.log({ originalUrl, member: session.member, accessToken: session.accessToken, accessRights: session.accessRights });
	await next();
});
