import Application from "../Application.js";
import {getData, deleteData, storeData} from "../entitymanager/DataManager.js";

const DATAID = "CAMPA";



Application.get(`/campa`, async (request, response) => {
	const campa = await getData(DATAID);
	response.json(campa);
});

Application.post(`/campa`, async ({body}, response) => {	
    console.log({body});
    const campa = body;
    await storeData(DATAID, campa);
    response.end();
});
