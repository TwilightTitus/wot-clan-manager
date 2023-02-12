import Application from "../Application.js";
import {getData, deleteData, storeData, getDataByType} from "../entitymanager/DataManager.js";

const TYPE = "CAMPA";

Application.get(`/campa`, async (request, response) => {
	const campa = await getDataByType(TYPE);
	response.json(campa);
});

Application.post(`/campa`, async ({body}, response) => {	
    console.log({body});
    const campa = await storeData({type: TYPE, payload: body});
    response.json(campa);
});
