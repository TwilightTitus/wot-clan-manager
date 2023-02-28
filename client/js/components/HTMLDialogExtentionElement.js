import { componentBaseOf, define } from "@default-js/defaultjs-html-components";

const NODENAME = "x-dialog";
const CLOSEMARKER = "[close-modal]";

class HTMLDialogExtentionElement extends componentBaseOf(HTMLDialogElement){

    static get NODENAME(){ return NODENAME; }

    constructor(){
        super();
        this.on("click", ({target}) => {
            if(target.is(CLOSEMARKER))
                this.close();
        });
    }

    async init(){
        await super.init();
    }

    hide(){
        this.close();
    }
}

define(HTMLDialogExtentionElement, { extends: "dialog"});
export default HTMLDialogExtentionElement;