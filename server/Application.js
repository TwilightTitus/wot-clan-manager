import express from "express";
import {BASEPATH__API} from "./Constants.js";

const SERVERPORT = parseInt(process.env.SERVER_PORT) || 3000;
const SERVER =  express();
SERVER.use(express.json()) // for parsing application/json
SERVER.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
SERVER.use(express.static("dist"));


export default {
    get(path, handle){
        SERVER.get(`${BASEPATH__API}${path}`, handle);
        return this;
    },
    post(path, handle){
        SERVER.post(`${BASEPATH__API}${path}`, handle);
        return this;
    },
    put(path, handle){
        SERVER.put(`${BASEPATH__API}${path}`, handle);
        return this;
    },
    patch(path, handle){
        SERVER.get(`${BASEPATH__API}${path}`, handle);
        return this;
    },
    delete(path, handle){
        SERVER.delete(`${BASEPATH__API}${path}`, handle);
        return this;
    },
    listen() {
        SERVER.listen(SERVERPORT, () => console.log(`Example app is listening on port ${SERVERPORT}.`));
    }
};


