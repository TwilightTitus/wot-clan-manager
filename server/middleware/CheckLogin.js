import Application from "../Application.js";
import { autorizationToken } from "../utils/AuthorizationUtil.js";
import { LOGIN_CHECK__IGRNORED_PATHS } from "../Constants.js";

Application.use(async (request, response, next) => {
	if (request.method == "OPTIONS") return next();

	if (LOGIN_CHECK__IGRNORED_PATHS.includes(request.path)) return next();

	const { session } = request;
	const { member, accessToken, accountId } = session;

	if (!member && !accessToken && !accountId) return response.status(401).end();

	const token = autorizationToken(request);
	if (!token) return response.status(401).end();

	if (accessToken != token) return response.status(401).end();

	await next();
});
