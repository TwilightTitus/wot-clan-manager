import Connection from "./Connection.js";

export default class DatabaseClient{

    constructor(){
        
    }

    async connection(){
        return new Connection();
    }

    async close(){

    }
};