import { CLANIDS } from "../Constants.js";
import { getProfiles } from "../wotservices/ProfileService.js";
import { getClanProfiles } from "../wotservices/ClanService.js";

import { storeClan } from "../entitymanager/ClanManager.js";
import { storeMember, getAllMemberIds } from "../entitymanager/MemberManager.js";

const execute = async () => {
	const clans = await getClanProfiles(CLANIDS);
	let memberIds = await getAllMemberIds();
	const promises = clans.map(async (clan) => {
		await storeClan(clan);
		await syncClanMembers(clan.members, clan);

		memberIds = memberIds.filter((id) => !clan.members[id]);
	});
	await Promise.all(promises);
	await cleanMembers(memberIds);
};

const syncClanMembers = async (members, clan) => {
	const memberIds = Object.getOwnPropertyNames(members);
	const memberProfiles = await getProfiles(memberIds);
	const promises = memberProfiles.map(async (profile) => {
		profile.role = members[profile.id].role;
		profile.clantag = clan.tag;
		profile.clanname = clan.name;
		await storeMember(profile);
	});
	await Promise.all(promises);
};

const cleanMembers = async (memberIds) => {
	const memberProfiles = await getProfiles(memberIds);
	if (memberProfiles) {
		const promises = memberProfiles.map(async (profile) => {
			profile.role = "exmember";
			profile.clanid = null;
			profile.clantag = null;
			profile.clanname = null;
			await storeMember(profile);
		});
		await Promise.all(promises);
	}
};

export default { execute };
