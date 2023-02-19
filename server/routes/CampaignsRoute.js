import Application from "../Application.js";
import {getCampaign, getCampaigns, storeCampaign, deleteCampaign} from "../entitymanager/CampaignManager.js";
import {deleteTeam} from "../entitymanager/TeamManager.js";

Application.get(`/campaigns`, async (request, response) => {
	const campaigns = await getCampaigns();
	response.json(campaigns);
});

Application.post(`/campaigns`, async ({body}, response) => {
    const campaign = await storeCampaign(body);
    response.json(campaign);
});

Application.get(`/campaigns/:id`, async (request, response) => {
    const id = request.param("id");
    const campaigns = await getCampaign(id);
	response.json(campaigns);
});

Application.delete(`/campaigns/:id`, async (request, response) => {
    const id = request.param("id");
    const campaign = await getCampaign(id);
    await deleteCampaign(id);

    const teams = campaign?.payload?.teams;
    if(teams)
        for(let team of teams)
            deleteTeam(team);

	response.json();
});
