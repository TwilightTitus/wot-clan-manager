import {getJSON, postJSON, deleteJSON} from "./ServiceUtils.js";
import { member } from "./LoginService.js";

const ENDPOINT = (campaign) => `/api/campaigns/${campaign}/registrations`;
const ENDPOINTBYMEMBER = (campaign, member) => `${ENDPOINT(campaign)}/${member}`;

const CACHE = new Map();

const getCachedRegistrations = (campaign) => {
    return CACHE.get(campaign);
}
const getCachedRegistration = (campaign, member) => {    
    const registrations = getCachedRegistrations(campaign);
    if(registrations)
        return registrations.get(member);

    return null;
}

const cacheRegistration = (registration) =>{
    if(!registration) return;
    const { campaignid, memberid } = registration;
    const cache = (() => {
        if(!CACHE.has(campaignid))
            CACHE.set(campaignid, new Map());

        return CACHE.get(campaignid);
    })();
    cache.set(memberid, registration);
}

export const getRegistrations = async (campaign) =>{
    if(CACHE.has(campaign))
        return Array.from(getCachedRegistrations(campaign).values());

    const registrations = await getJSON(ENDPOINT(campaign));
    for(const registration of registrations)
        cacheRegistration(registration);

    return registrations;
}

export const storeRegistration = async (campaign, registration) => {
    registration = await postJSON(ENDPOINT(campaign), registration);
    cacheRegistration(registration);
    return registration;
}

export const getMyRegistration = async (campaign) => {
    return getRegistrationByMember(campaign,  member().id);
} 

export const getRegistrationByMember = async (campaign, member) => {
    let registration = getCachedRegistration(campaign, member);
    if(!registration){
        registration = await getJSON(ENDPOINTBYMEMBER(campaign, member));
        cacheRegistration(registration);
    }
    return registration;
} 
