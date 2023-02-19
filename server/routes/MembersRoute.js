import Application from "../Application.js";
import { getMembers, getMember } from "../entitymanager/MemberManager.js";

const ENDPOINT = "/members";

const CACHE = new Map();

Application.get(ENDPOINT, async (request, response) => {	
	const members = await getMembers();
	response.json(members);
});

Application.get(`ENDPOINT/:id`, async (request, response) => {	
	const id = request.param("id")
	const member = await getMember(id);
	response.json(member);
});

