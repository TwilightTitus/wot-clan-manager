import Application from "./Application.js";
import "./middleware/index.js";
import "./routes/index.js";

import DatabaseClient from "./utils/DatabaseClient.js";
import MigrationTool from "./mirgatedb/MigrationTool.js";


const migrationTool = new MigrationTool(DatabaseClient);
await migrationTool.migrate();

Application.listen();



