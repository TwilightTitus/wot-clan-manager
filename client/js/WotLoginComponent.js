import {Component, define} from "@default-js/defaultjs-html-components";
import {login} from "./services/WotLoginService.js";

export const NODENAME = "x-wot-login-component";

const toBase64 = function(payload) { // payload is a JSON object
    payload = JSON.stringify(payload)
    payload = window.btoa(payload)
    return payload;
  }

class WotLoginComponent extends Component{

    static get NODENAME(){
        return NODENAME;
    }

    constructor(){
        super();
    }

    async init(){
        await super.init();
        const user = login();



        await fetch(new URL("/api", location), {headers: {
            "Authorization": `Bearer ${toBase64(user)}`
        }})
       
    }

};

define(WotLoginComponent);

export default WotLoginComponent;