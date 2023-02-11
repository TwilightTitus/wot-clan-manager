import Application from "../../Application.js";
import { API_MANAGEMENT } from "../../Constants.js";
import DataSyncJob from "../../jobs/DataSyncJob.js"

Application.get(`${API_MANAGEMENT}/sync-data`, async ({session}, response) => {
    await DataSyncJob.execute();	
});
