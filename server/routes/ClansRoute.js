import Application from "../Application.js";
import { getClans } from "../entitymanager/ClanManager.js";
import { getMemberOfClan } from "../entitymanager/MemberManager.js";

Application.get(`/clans`, async (request, response) => {
	const clans = await getClans();

	response.json({ clans });
});

Application.get(`/clans/:clanId/members`, async ({params}, response) => {	
	const clanId = parseInt(params.clanId || "-1");
	const members = await getMemberOfClan(clanId);

	response.json({ members });
});
