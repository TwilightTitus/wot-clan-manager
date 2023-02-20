import Application from "../Application.js";
import { getTeam, getTeams, storeTeam, deleteTeam } from "../entitymanager/TeamManager.js";
import { accessRights, currentMember } from "../utils/RequestUtils.js";

const PATHPARAM__TEAMID = "teamId";
const ENDPOINT = `/teams`;
const ENDPOINT_WITH_TEAMID = `${ENDPOINT}/:${PATHPARAM__TEAMID}`;

Application.get(ENDPOINT, async (request, response) => {
	const teams = await getTeams();
	response.json(teams);
});

Application.post(ENDPOINT, async (request, response) => {
	if(!accessRights(request).management)
        return response.status(403).json({error: "no management rights"});

	const team = await storeTeam(request.body);
	response.json(team);
});

Application.get(ENDPOINT_WITH_TEAMID, async (request, response) => {
	const id = request.param(PATHPARAM__TEAMID);
	const team = await getTeam(id);
	response.json(team);
});

Application.delete(ENDPOINT_WITH_TEAMID, async (request, response) => {
	if(!accessRights(request).management)
        return response.status(403).json({error: "no management rights"});

	const id = request.param(PATHPARAM__TEAMID);
	await deleteTeam(id);

	response.json();
});
