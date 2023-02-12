import { TEMPLATE_BASEPATH } from "../Constants.js";
import { Component, define } from "@default-js/defaultjs-html-components";
import { Renderer, Template } from "@default-js/defaultjs-template-language";
import "@default-js/defaultjs-html-form";

export const NODENAME = "x-campa";

const TEMPLATE_URL__ROOT = new URL(`${TEMPLATE_BASEPATH}/htmlcampaelement/root.tpl.html`, location);
const TEMPLATE_URL__CREATEDIALOG = new URL(`${TEMPLATE_BASEPATH}/htmlcampaelement/create-dialog.tpl.html`, location);

class HTMLCampaElement extends Component {
	static get NODENAME() {
		return NODENAME;
	}

	#initialized = false;
	#campa = null;
    #createDialog;

	constructor() {
		super();
        const root = this.root;
        root.on("action:open-campa-dialog", (event) => {
            event.stopPropagation();
            this.openCreateDialog();
        });
        root.on("action:close-campa-dialog", (event) => {
            event.stopPropagation();
            if(this.#createDialog)
            this.#createDialog.close();
        });
	}

	async init() {
		if (!this.#initialized) {
			await this.render();
		}
	}

    async render() {
        const template = await Template.load(TEMPLATE_URL__ROOT);
			await Renderer.render({ container: this.root, template, data: {campa: await this.campaData()} });
    }

    async campaData(){
        if(!this.#campa){
            const response = await fetch(new URL(`/api/campa`, location));
            this.#campa = await response.json();
            console.log(this.#campa)
        }

        return this.#campa;
    }

    async openCreateDialog() {
        const root = this.root;
        if(!this.#createDialog){
            const template = await Template.load(TEMPLATE_URL__CREATEDIALOG);
            const result = await Renderer.render({template, container: root, data: {}, mode:"append"});           
            this.#createDialog = result.content[0];
            this.#createDialog.on("d-form-submit", (event) => {
                event.preventDefault();
                event.stopPropagation();
                const form = event.target;
                (async () => {
                    const data = await form.value();
                    console.log(data);

                    await fetch(new URL("/api/campa", location), {
                        method: "post",
                        headers: {"content-type": "application/json" },
                        body: JSON.stringify(data)
                    });
                    this.#createDialog.close();
                    this.#campa = null;
                    await this.render();
                })();
            })
        }

        this.#createDialog.showModal();
    }
	
}

define(HTMLCampaElement);
export default HTMLCampaElement;
