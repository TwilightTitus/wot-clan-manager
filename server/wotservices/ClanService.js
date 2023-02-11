import fetch from "node-fetch";
import { APPLICATIONID, WOT_ENDPOINT_BASE } from "../Constants.js";

const extra = "";
const fields = "clan_id,name,tag,members.account_id,members.role";

const clanMapper = (clan) => {

	return {
		id: clan.clan_id,
		name: clan.name,
		tag: clan.tag,
		members: (() => {
			const result = {};

			for (const [id, role] of Object.entries(clan.members)) result[id] = role;

			return result;
		})(),
	};
};

export const getClanProfiles = async (clanIds) => {
	try {
		const url = new URL(`${WOT_ENDPOINT_BASE}/wot/clans/info/`);
		url.searchParams.set("application_id", APPLICATIONID);
		url.searchParams.set("clan_id", clanIds.join(","));
		url.searchParams.set("extra", extra);
		url.searchParams.set("fields", fields);
		url.searchParams.set("members_key", "id");

		let response = await fetch(url);
		response = await response.json();
		const { status, data } = response;
		if (status == "error" || !data) return null;

		const clans = [];
		for (let clan in data) clans.push(clanMapper(data[clan]));

		return clans;
	} catch (e) {
		console.error(e);
		return null;
	}
};

export const getClanProfile = async (clanId) => {
	const clans = await getClanProfile([clanId]);
	if (clans && clans.length == 1) return clans[0];

	return null;
};
