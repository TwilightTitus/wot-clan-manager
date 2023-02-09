import fetch from "node-fetch";
import { APPLICATIONID, WOT_ENDPOINT_BASE } from "../Constants.js";

const extra ="private.garage";
const fields = "nickname,account_id,clan_id,global_rating,private.garage"

const profileMapper = (profile) => {

	console.log(profile);

	return {
		id: profile.account_id,
		username: profile.nickname,
		clanid: profile.clan_id,
		wtr: profile.global_rating,
	};
};

export const getProfileByAccessToken = async (accessToken) => {
	return getProfile(accessToken);
};

export const getProfile = async (accessToken, accountId) => {
	try {
		const url = new URL(`${WOT_ENDPOINT_BASE}/wot/account/info/`);
		url.searchParams.set("application_id", APPLICATIONID);
		url.searchParams.set("account_id", accountId);
		url.searchParams.set("access_token", accessToken);
		url.searchParams.set("extra", extra);
		url.searchParams.set("fields", fields);

		let response = await fetch(url);
		response = await response.json();
		const { status, data } = response;
		if (status == "error" || !data) return null;

		response = data[accountId];
		if (!response) return null;

		return profileMapper(response);
	} catch (e) {
		console.error(e);
		return null;
	}
};
