import { TEMPLATE_BASEPATH } from "../Constants.js";
import { Component, define } from "@default-js/defaultjs-html-components";
import { Renderer, Template } from "@default-js/defaultjs-template-language";
import { getCampaign, deleteCampaign } from "../services/CampaignService.js";
import "@default-js/defaultjs-html-form";

const TEMPLATES_PATH = `${TEMPLATE_BASEPATH}/html-campaign-element`
export const NODENAME = "x-campaign";
const ATTR__CAMPAIGN = "campaign";

const TEMPLATE_URL__ROOT = new URL(`${TEMPLATES_PATH}/root.tpl.html`, location);

class HTMLCampaignElement extends Component {
	static get NODENAME() {
		return NODENAME;
	}

	#initialized = false;
	#campaign = null;

	constructor() {
		super();
	}

	async init() {
		if (!this.#initialized) {
			await this.render();

            this.#initialized = true;
		}
	}

    async render() {
        const template = await Template.load(TEMPLATE_URL__ROOT);
			await Renderer.render({ container: this.root, template, data: {campaign: await this.campaignData()} });
    }

    async campaignData(){
        if(!this.#campaign)
            this.#campaign = await getCampaign(this.attr(ATTR__CAMPAIGN));

        return this.#campaign;
    }	
}

define(HTMLCampaignElement);
export default HTMLCampaignElement;
