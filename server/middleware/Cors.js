import Application from "../Application.js";

Application.use( (request, response, next) => {

    console.log(request.method);
    const origin = request.get("Origin");
    if(origin){
        response.append("Access-Control-Allow-Origin", origin);        
        response.append("Access-Control-Allow-Headers", "Authorization, Content-Type, Cookies");
    }
    if(request.method == "OPTIONS")
        response.status(204).end();
    else
        next();
});