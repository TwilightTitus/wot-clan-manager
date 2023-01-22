import Application from "./Application.js";
//import "./middleware/index.js";
import "./routes/index.js";

import MigrationTool from "./mirgatedb/MigrationTool.js";
import DatabaseClient from "./mirgatedb/DatabaseClient.js";


const migrationTool = new MigrationTool(new DatabaseClient());
await migrationTool.migrate();

Application.listen();


