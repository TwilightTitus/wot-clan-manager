import Application from "../../Application.js";
import { APPLICATIONID, BASEPATH__API, WOT_ENDPOINT_LOGIN, WOT_ENDPOINT_LOGIN_REFESH, API_SYSTEM_LOGIN, CLANIDS } from "../../Constants.js";
import { getMember } from "../../entitymanager/MemberManager.js";
import { checkIfUser } from "../../wotservices/ProfileService.js";

const API_PATH = API_SYSTEM_LOGIN;
const PARAM__ACCESSTOKEN = "access_token";
const PARAM__EXPIRESAT = "expires_at";
const PARAM__ID = "account_id";
const PARAM__REDIRECT_TO = "redirect_to";

const toWOTLogin = async (request, response) => {
	const url = new URL(WOT_ENDPOINT_LOGIN);
	url.searchParams.set("application_id", APPLICATIONID);
	url.searchParams.set("display", "page");
	url.searchParams.set("nofollow", "0");
	url.searchParams.set("redirect_uri", "http://localhost:3000/api/system/login");

	response.redirect(url.toString());
};

const loginUser = async (request, response) => {
	console.log("login User")
	const { query, session } = request;
	const accessToken = query[PARAM__ACCESSTOKEN];
	const accountId = query[PARAM__ID];
	const expiredAt = query[PARAM__EXPIRESAT];
	if(!accessToken && !accountId)	return false;	

	session.accessToken = accessToken;
	session.accountId = accountId;

	if(!(await checkIfUser(accessToken, accountId)))	
		return response.status(401).end();

	session.expiredAt = expiredAt * 1000;
	const member = session.member = await getMember(accountId);
	if(!member)
		return response.status(403).end();

	if(!CLANIDS.includes(member.clanid))
		return response.status(403).end();
	
		
	response.redirect("/");

	return true;
};

Application.get(API_PATH, async (request, response) => {
	if (await loginUser(request, response)) return;
	await toWOTLogin(request, response);
});
