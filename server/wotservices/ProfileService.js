import fetch from "node-fetch";
import {APPLICATIONID} from "../Constants.js";

export const getProfile = async (accountId, accessToken) => {

    const url = new URL("https://api.worldoftanks.eu/wot/account/info/");
    url.searchParams.set("application_id", APPLICATIONID);
    url.searchParams.set("account_id", accountId);
    url.searchParams.set("access_token", accessToken);

    let response = await fetch(url);
    response = await response.json();

    response = response?.data[accountId];
    if(!response )
        return null;

    const profile = {
        id: accountId,
        username: response.nickname,
        budgets : {
            bonds: response.private.bonds 
        },
        clanid: response.clan_id,
        rating: {
            wtr: response.global_rating
        } 
    }
    

    console.log(profile);

    return profile;
}