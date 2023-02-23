import {getJSON, postJSON, deleteJSON} from "./ServiceUtils.js";
import { member } from "./LoginService.js";

const ENDPOINT = (campaign) => `/api/campaigns/${campaign}/registrations`;
const ENDPOINTBYMEMBER = (campaign, member) => `${ENDPOINT(campaign)}/${member}`;


export const getRegistrations = async (campaign) =>{
    return getJSON(ENDPOINT(campaign));
}

export const storeRegistration = async (campaign, registration) => {
    return postJSON(ENDPOINT(campaign), registration);
}

export const getMyRegistration = async (campaign) => {
    return getJSON(ENDPOINTBYMEMBER(campaign, member().id))
} 

export const getRegistrationByMember = async (campaign, member) => {
    return getJSON(ENDPOINTBYMEMBER(campaign, member));
} 
