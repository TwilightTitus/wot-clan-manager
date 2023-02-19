import Application from "../Application.js";
import { getTeam, getTeams, storeTeam, deleteTeam } from "../entitymanager/TeamManager.js";

const ENDPOINT = `/teams`;

Application.get(ENDPOINT, async (request, response) => {
	const teams = await getTeams();
	response.json(teams);
});

Application.post(ENDPOINT, async ({ body }, response) => {
	const team = await storeTeam(body);
	response.json(team);
});

Application.get(`${ENDPOINT}/:id`, async (request, response) => {
	const id = request.param("id");
	const team = await getTeam(id);
	response.json(team);
});

Application.delete(`${ENDPOINT}/:id`, async (request, response) => {
	const id = request.param("id");
	await deleteTeam(id);

	response.json();
});
