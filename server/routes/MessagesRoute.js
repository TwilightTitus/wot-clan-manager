import { resourceUsage } from "process";
import Application from "../Application.js";
import { storeMessage, getMessage, getMessages, MESSAGE_TYPE__NOTIFICATION, MESSAGE_TYPE__MEMBER, MessageFilter } from "../entitymanager/MessageManager.js";
import { accessRights, currentMember } from "../utils/RequestUtils.js";

const PATHPARAM__ID = "id";
const PATHPARAM__TYPE = "type";
const PATHPARAM__REFERENCE = "reference";

const ENDPOINT = `/messages`;
const ENDPOINT_WITH_ID = `${ENDPOINT}/:${PATHPARAM__ID}`;
const ENDPOINT_WITH_TYPE = `${ENDPOINT}/types/:${PATHPARAM__TYPE}`;
const ENDPOINT_WITH_TYPE_AND_REFERENCE = `${ENDPOINT_WITH_TYPE}/:${PATHPARAM__REFERENCE}`;


export const ACCESSCHECK_BY_MESSAGETYPE = {
	[MESSAGE_TYPE__NOTIFICATION]: () => true,
	[MESSAGE_TYPE__MEMBER]: (request) => accessRights(request).management
}

Application.post(ENDPOINT, async (request, response) => {
	const {type} = request.params;
	const check = ACCESSCHECK_BY_MESSAGETYPE[type];
	if(!check)
		return response.status(404).json({error: `Message type "${type}" is not supported!`});
	if(!check(request))
        return response.status(403).json({error: "Insufficient rights!"});

	let message = request.body;
	message.memberid = currentMember(request).id;
	message = await storeMessage(request.body);
	
	response.json(message);
});

Application.get(ENDPOINT_WITH_ID, async (request, response) => {
	const {id} = request.params;	
	const message = await getMessage({id});
	
	const check = ACCESSCHECK_BY_MESSAGETYPE[message.type];
	if(!check)
		return response.status(404).json({error: `Message type "${type}" is not supported!`});
	if(!check(request))
        return response.status(403).json({error: "Insufficient rights!"});
	
	response.json(message);
});

Application.get(ENDPOINT_WITH_TYPE, async (request, response) => {
	const {type} = request.params;
	const check = ACCESSCHECK_BY_MESSAGETYPE[type];
	if(!check)
		return response.status(404).json({error: `Message type "${type}" is not supported!`});
	if(!check(request))
        return response.status(403).json({error: "Insufficient rights!"});

	const filter = new MessageFilter(request.query);

	const messages = await getMessages({type, filter});
	
	response.json(messages);
});

Application.get(ENDPOINT_WITH_TYPE_AND_REFERENCE, async (request, response) => {
	const {type, reference} = request.params;
	const check = ACCESSCHECK_BY_MESSAGETYPE[type];
	if(!check)
		return response.status(404).json({error: `Message type "${type}" is not supported!`});
	if(!check(request))
        return response.status(403).json({error: "Insufficient rights!"});

	const filter = new MessageFilter(request.query);

	const messages = await getMessages({type, reference, filter});
	
	response.json(messages);
});

