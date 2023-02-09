import Application from "../../Application.js";
import { autorizationToken } from "../../utils/AuthorizationUtil.js";
import { API_SYSTEM_ACCESS } from "../../Constants.js";

Application.get(API_SYSTEM_ACCESS, async (request, response) => {
	const { session } = request;
	const { member, accessToken, accountId, expiredAt } = session;

	if (!member && !accessToken && !accountId) {
		response.status(401).end();
		return;
	}

	if (expiredAt - (Date.now() + 60 * 1000) <= 0) {
		const token = autorizationToken(request);
		if (accessToken != token) {
			response.status(401).end();
			return;
		}
	}
	response.json({
		accessToken: session.accessToken,
		expireAt: session.expiredAt,
		member,
	});
});
