import Application from "../Application.js";
import { getMembers, getMember } from "../entitymanager/MemberManager.js";

const PATHPARAM__MEMBERID = "memberId";
const ENDPOINT = "/members";
const ENDPOINT_BY_ID = `${ENDPOINT}/:${PATHPARAM__MEMBERID}`;

Application.get(ENDPOINT, async (request, response) => {	
	const members = await getMembers();
	response.json(members);
});

Application.get(ENDPOINT_BY_ID, async (request, response) => {	
	const id = request.param(PATHPARAM__MEMBERID)
	const member = await getMember(id);
	response.json(member);
});

