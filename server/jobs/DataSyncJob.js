import { CLANIDS } from "../Constants.js";
import { getProfiles } from "../wotservices/ProfileService.js";
import { getClanProfiles } from "../wotservices/ClanService.js";

import { storeClan } from "../entitymanager/ClanManager.js";
import { storeMember } from "../entitymanager/MemberManager.js";

const execute = async () => {
	const clans = await getClanProfiles(CLANIDS);
    const promises = clans.map(async (clan) => {
        await storeClan(clan);
	    await syncClanMembers(clan.members);
    });

    await Promise.all(promises);
};

const syncClanMembers = async (members) => {
	const memberIds = Object.getOwnPropertyNames(members);
	const memberProfiles = await getProfiles(memberIds);
	const promises = memberProfiles.map(async (profile) => {
		profile.role = members[profile.id].role;
		await storeMember(profile);
	});
	await Promise.all(promises);
};

export default { execute };
