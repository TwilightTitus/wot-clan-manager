import Application from "../Application.js";
import {getProfile} from "../wotservices/ProfileService.js";


Application.get("/" , async (req, res) => {   
    const result = "test";
    
    
    res.json(result);
});