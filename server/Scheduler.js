import Scheduler from "node-schedule";

// Import JOBS
import DataSyncJob from "./jobs/DataSyncJob.js";

//Scheduling

let started = false;

export const startScheduling = () => {
	if (started) return;

	Scheduler.scheduleJob("0 0 0 * * *", () => DataSyncJob.execute());

	started = true;
};
