import Application from "../Application.js";
import { accessRights, currentMember } from "../utils/RequestUtils.js";
import { storeCampaignRegistration, getCampaignRegistrations, getCampaignRegistration, deleteCampaignRegistration } from "../entitymanager/CampaignRegistrationManager.js";

const PATHPARAM__CAMPAIGNID = "campaignid";
const PATHPARAM__MEMBERID = "memberid";
const ENDPOINT = `/campaigns/:${PATHPARAM__CAMPAIGNID}/registrations`;
const ENDPOINT_WITH_MEMBERID = `/campaigns/:${PATHPARAM__CAMPAIGNID}/registrations/:${PATHPARAM__MEMBERID}`;

Application.get(ENDPOINT, async (request, response) => {
    if(!accessRights(request).management)
        return response.status(403).json({error: "no management rights"});
        
	const campaign = request.params[PATHPARAM__CAMPAIGNID];		
	const registrations = await getCampaignRegistrations(campaign);
	response.json(registrations);
});

Application.post(ENDPOINT, async (request, response) => {
	const campaign = request.params[PATHPARAM__CAMPAIGNID];
	const member = currentMember(request).id;
	const body = request.body;

	body.campaignid = campaign;
	body.memberid = member;
	const registration = await storeCampaignRegistration(body);
	response.json(registration);
});

Application.delete(ENDPOINT, async (request, response) => {
	const campaign = request.params[PATHPARAM__CAMPAIGNID];
	const member = currentMember(request).id;
	await deleteCampaignRegistration(campaign, member);
	response.json();
});

Application.get(ENDPOINT_WITH_MEMBERID, async (request, response) => {
	const campaign = request.params[PATHPARAM__CAMPAIGNID];
	const member =  request.params[PATHPARAM__MEMBERID];

	if(!accessRights(request).management && member != currentMember(request).id)
        return response.status(403).json({error: "no management rights"});
    
	const registration = await getCampaignRegistration(campaign, member);
	response.json(registration);
});

Application.delete(ENDPOINT_WITH_MEMBERID, async (request, response) => {
	if(!accessRights(request).management)
        return response.status(403).json({error: "no management rights"});
    
	const campaign = request.params[PATHPARAM__CAMPAIGNID];
	const member = request.params[PATHPARAM__MEMBERID];
	const registration = await getCampaignRegistration(campaign, member);
	response.json(registration);
});
