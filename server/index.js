import Application from "./Application.js";
import "./middleware/index.js";
import "./routes/index.js";
import { startup} from "./Startup.js";

await startup();

Application.listen();





