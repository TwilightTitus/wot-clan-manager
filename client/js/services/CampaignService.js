import {getJSON, postJSON, deleteJSON} from "./ServiceUtils.js";

const ENDPOINT = `/api/campaigns`;

const CACHE = new Map();

export const getCampaigns = async () => {
    let campaigns = null
    if(CACHE.size == 0){
        campaigns = await getJSON(ENDPOINT);
        for(const campaign of campaigns)
            CACHE.set(campaign.id, campaign);
    }
    else {
        campaigns = [];
        for(const [key, campaign] of CACHE)
            campaigns.push(campaign);
    }

    console.log({campaigns});

    return campaigns;
};

export const getCampaign = async (id) => {
    if(CACHE.has(id))
        return CACHE.get(id);

    const campaign = await getJSON(`${ENDPOINT}/${id}`);
    CACHE.set(campaign.id, campaign);

    console.log({campaign});

    return campaign;
};

export const storeCampaign = async (campaign) => {
    campaign = await postJSON(`${ENDPOINT}`, campaign);
    CACHE.set(campaign.id, campaign);

    console.log({campaign});

    return campaign;
};

export const deleteCampaign = async (id) => {
    await deleteJSON(`${ENDPOINT}/${id}`);
    CACHE.delete(id);
};