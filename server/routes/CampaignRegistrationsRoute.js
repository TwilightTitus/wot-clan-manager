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
        
	const campaignId = request.param(PATHPARAM__CAMPAIGNID);
	const registrations = await getCampaignRegistrations(campaignId);
	response.json(registrations);
});

Application.post(ENDPOINT, async (request, response) => {
	const campaignId = request.param(PATHPARAM__CAMPAIGNID);
	const memberId = currentMember(request).id;
	const body = request.body;

	body.campaignId = campaignId;
	body.memberId = memberId;
	const registration = await storeCampaignRegistration(body);
	response.json(registration);
});

Application.delete(ENDPOINT, async (request, response) => {
	const campaignId = request.param(PATHPARAM__CAMPAIGNID);
	const memberId = request.session.member.id;
	await deleteCampaignRegistration(campaignId, memberId);
	response.json();
});

Application.get(ENDPOINT_WITH_MEMBERID, async (request, response) => {
	if(!accessRights(request).management)
        return response.status(403).json({error: "no management rights"});
    
	const campaignId = request.param(PATHPARAM__CAMPAIGNID);
	const memberId = request.param(PATHPARAM__MEMBERID);
	const registration = await getCampaignRegistration(campaignId, memberId);
	response.json(registration);
});

Application.delete(ENDPOINT_WITH_MEMBERID, async (request, response) => {
	if(!accessRights(request).management)
        return response.status(403).json({error: "no management rights"});
    
	const campaignId = request.param(PATHPARAM__CAMPAIGNID);
	const memberId = request.param(PATHPARAM__MEMBERID);
	const registration = await getCampaignRegistration(campaignId, memberId);
	response.json(registration);
});
