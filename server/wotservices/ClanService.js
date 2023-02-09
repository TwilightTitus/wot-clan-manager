import fetch from "node-fetch";
import { APPLICATIONID, WOT_ENDPOINT_BASE } from "../Constants.js";

const extra = "";
const fields = "clan_id,name,tag,members.account_id,members.role";

const clanMapper = async (clan) => {
	return {
		id: clan.clan_id,
		name: clan.name,
		tag: clan.tag,
		members: (() => {
			const result = {};

			for (const [key, value] of Object.entries(clan.members)) { 
				result[key] = value.role;
			}

			return result;
		})()
	};
};

export const getClanData = async (accessToken, clanId) => {
	try {
		const url = new URL(`${WOT_ENDPOINT_BASE}/wot/clans/info/`);
		url.searchParams.set("application_id", APPLICATIONID);
		url.searchParams.set("clan_id", clanId);
		url.searchParams.set("access_token", accessToken);
		url.searchParams.set("extra", extra);
		url.searchParams.set("fields", fields);
		url.searchParams.set("members_key", "id");

		let response = await fetch(url);
		response = await response.json();
		const { status, data } = response;
		if (status == "error" || !data) return null;

		const clanData = data[clanId];
		if (!clanData) return null;

		return clanMapper(clanData);
	} catch (e) {
		console.error(e);
		return null;
	}
};
