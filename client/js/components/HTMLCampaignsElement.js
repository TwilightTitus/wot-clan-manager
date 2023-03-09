import { TEMPLATE_BASEPATH, EVENT__GLOBAL_ACTION_RELOADPARENT } from "../Constants.js";
import { Component, define } from "@default-js/defaultjs-html-components";
import { Renderer, Template } from "@default-js/defaultjs-template-language";
import { getCampaigns, deleteCampaign, storeCampaign } from "../services/CampaignService.js";
import { accessRights } from "../services/LoginService.js";
import "@default-js/defaultjs-html-form";

const TEMPLATES_PATH = `${TEMPLATE_BASEPATH}/html-campaigns-element`
export const NODENAME = "x-campaigns";

const TEMPLATE_URL__ROOT = new URL(`${TEMPLATES_PATH}/root.tpl.html`, location);
const TEMPLATE_URL__CREATEDIALOG = new URL(`${TEMPLATES_PATH}/campaign-dialog.tpl.html`, location);

class HTMLCampaignsElement extends Component {
	static get NODENAME() {
		return NODENAME;
	}

	#initialized = false;
    #createDialog;

	constructor() {
		super();
        const root = this.root;
        root.on(EVENT__GLOBAL_ACTION_RELOADPARENT, (event) => {
            event.stopPropagation();
            this.render();            
        });
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
        await super.init();
		if (!this.#initialized) {
			await this.render();
            this.#initialized = true;
		}
	}

    async render() {
        const template = await Template.load(TEMPLATE_URL__ROOT);
		await Renderer.render({ container: this.root, template, data: {accessRights: accessRights(), campaigns: await getCampaigns()} });
    }

    async openCreateDialog() {
        const root = this.root;
        if(!this.#createDialog){
            const template = await Template.load(TEMPLATE_URL__CREATEDIALOG);
            const result = await Renderer.render({template, container: root, data: {accessRights: accessRights()}, mode:"append"});           
            this.#createDialog = result.content[0];
            this.#createDialog.on("d-form-submit", (event) => {
                event.preventDefault();
                event.stopPropagation();
                const form = event.target;
                (async () => {
                    const campaign = await form.value();
                    await storeCampaign(campaign);
                    
                    this.#createDialog.close();

                    await this.render();
                })();
            })
        }

        this.#createDialog.showModal();
    }
	
}

define(HTMLCampaignsElement);
export default HTMLCampaignsElement;
