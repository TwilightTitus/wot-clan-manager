import Application from "../../Application.js";
import { API_MANAGEMENT } from "../../Constants.js";
import {syncData } from "../../entitymanager/ClanManager.js";

Application.get(`${API_MANAGEMENT}/sync-data`, async ({session}, response) => {
	const {accessToken} = session;

    await syncData(accessToken);	
});
