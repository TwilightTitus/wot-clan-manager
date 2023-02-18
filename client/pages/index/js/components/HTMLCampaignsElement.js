import { TEMPLATE_BASEPATH } from "../Constants.js";
import { Component, define } from "@default-js/defaultjs-html-components";
import { Renderer, Template } from "@default-js/defaultjs-template-language";
import "@default-js/defaultjs-html-form";

const ENDPOINT = `/api/campaigns`;
const TEMPLATES_PATH = `${TEMPLATE_BASEPATH}/html-campaign-element`
export const NODENAME = "x-campaigns";

const TEMPLATE_URL__ROOT = new URL(`${TEMPLATES_PATH}/root.tpl.html`, location);
const TEMPLATE_URL__CREATEDIALOG = new URL(`${TEMPLATES_PATH}/campaign-dialog.tpl.html`, location);

class HTMLCampaignsElement extends Component {
	static get NODENAME() {
		return NODENAME;
	}

	#initialized = false;
	#campaigns = null;
    #createDialog;

	constructor() {
		super();
        const root = this.root;
        root.on("action:create-campaign", (event) => {
            event.stopPropagation();
            this.openCreateDialog();
        });
        root.on("action:close-campaign-dialog", (event) => {
            event.stopPropagation();
            if(this.#createDialog)
            this.#createDialog.close();
        });
	}

	async init() {
		if (!this.#initialized) {
			await this.render();

            this.#initialized = true;
		}
	}

    async render() {
        const template = await Template.load(TEMPLATE_URL__ROOT);
			await Renderer.render({ container: this.root, template, data: {campaigns: await this.campaignsData()} });
    }

    async campaignsData(){
        if(!this.#campaigns){
            const response = await fetch(new URL(ENDPOINT, location));
            this.#campaigns = await response.json();
            console.log(this.#campaigns)
        }

        return this.#campaigns;
    }

    async campaignData(id){
        const campaigns = await campaignsData();
        return campaigns.find((campaign) => campaign.id == id);
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

                    await fetch(new URL("/api/campaigns", location), {
                        method: "post",
                        headers: {"content-type": "application/json" },
                        body: JSON.stringify(data)
                    });
                    this.#createDialog.close();
                    this.#campaigns = null;
                    await this.render();
                })();
            })
        }

        this.#createDialog.showModal();
    }
	
}

define(HTMLCampaignsElement);
export default HTMLCampaignsElement;
