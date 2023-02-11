import DatabaseClient from "./utils/DatabaseClient.js";
import MigrationTool from "./mirgatedb/MigrationTool.js";
import { startScheduling } from "./Scheduler.js";
import DataSyncJob from "./jobs/DataSyncJob.js";

export const startup = async () => {
	const migrationTool = new MigrationTool(DatabaseClient);
	await migrationTool.migrate();

	await DataSyncJob.execute();

	startScheduling();
};
