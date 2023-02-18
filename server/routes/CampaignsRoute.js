import Application from "../Application.js";
import {getCampaign, getCampaigns, storeCampaign} from "../entitymanager/CampaignManager.js";

Application.get(`/campaigns`, async (request, response) => {
	const campaigns = await getCampaigns();
	response.json(campaigns);
});

Application.post(`/campaigns`, async ({body}, response) => {
    const campaign = await storeCampaign(body);
    response.json(campaign);
});

Application.get(`/campaigns/:id`, async (request, response) => {
    const id = request.getParam("id");
    const campaigns = await getCampaign(id);
	response.json(campaigns);
});
