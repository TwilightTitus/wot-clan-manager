import fetch from "node-fetch";
import { APPLICATIONID, WOT_ENDPOINT_BASE } from "../Constants.js";

const fields = "nickname,account_id,clan_id,global_rating";

const profileMapper = (profile) => {
	return {
		id: profile.account_id,
		name: profile.nickname,
		clanid: profile.clan_id,
		wtr: profile.global_rating || 0,
	};
};

export const checkIfUser = async (accessToken, accountId) => {
	try {
		const url = new URL(`${WOT_ENDPOINT_BASE}/wot/account/info/`);
		url.searchParams.set("application_id", APPLICATIONID);
		url.searchParams.set("account_id", accountId);
		url.searchParams.set("access_token", accessToken);
		url.searchParams.set("fields", `private.credits`);

		let response = await fetch(url);
		response = await response.json();
		const { status, data } = response;
		if (status == "error" || !data) return null;

		const profile = data[accountId];
		if (!profile) return false;

		return !!profile.private
	} catch (e) {
		console.error(e);
	}	
	return false;
};


export const getProfiles = async (accountIds = []) => {
	try {
		const url = new URL(`${WOT_ENDPOINT_BASE}/wot/account/info/`);
		url.searchParams.set("application_id", APPLICATIONID);
		url.searchParams.set("account_id", accountIds.join(","));
		url.searchParams.set("fields", fields);

		let response = await fetch(url);
		response = await response.json();
		const { status, data } = response;
		if (status == "error" || !data) return null;		

		const profiles = [];
		for( let profile in data)
			profiles.push(profileMapper(data[profile]));

		return profiles;
	} catch (e) {
		console.error(e);
		return null;
	}
};


export const getProfile = async (accountId) => {
	const profiles = getProfiles([accountId]);
	if(profiles &&  profiles.length == 1)
		return profiles[0];

	return null;
};
