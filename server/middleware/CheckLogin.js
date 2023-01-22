import Application from "../Application.js";
const HEADER_AUTHORIZATION = "Authorization";


const toUser = (data) => {
    return JSON.parse(Buffer.from(data, "base64"));
};



Application.use( (request, response, next) => {
    if(request.method != "OPTIONS"){
        let value = request.get(HEADER_AUTHORIZATION);
        if(!value)
            return response.status(401).end();
        
        value = /Bearer (.+)/ig.exec(value);
        if(!value || !value[1])
            return response.status(401).end();       
        
        const user = toUser(value[1]);

        request.user = user;
    }

    next();
});