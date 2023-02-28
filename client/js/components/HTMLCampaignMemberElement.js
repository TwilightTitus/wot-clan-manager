import { TEMPLATE_BASEPATH, EVENT__GLOBAL_ACTION_RELOADPARENT } from "../Constants.js";
import { Component, define } from "@default-js/defaultjs-html-components";
import { Renderer, Template } from "@default-js/defaultjs-template-language";
import { getRegistrations, getMyRegistration, getRegistrationByMember, storeRegistration } from "../services/CampaignRegistrationService.js";
import { getMember } from "../services/MemberService.js";

const TEMPLATES_PATH = `${TEMPLATE_BASEPATH}/html-campaign-member-element`;
export const NODENAME = "x-campaign-member";
const ATTR__CAMPAIGNID = "campaign-id";
const ATTR__MEMBERID = "member-id";

const TEMPLATE_ROOT = Template.load(new URL(`${TEMPLATES_PATH}/root.tpl.html`, location));

class HTMLCampaignMemberElement extends Component {
	static get NODENAME() {
		return NODENAME;
	}

	#initialized = false;

	constructor() {
		super();
	}

	async init() {
		await super.init();
		if (!this.#initialized) {
			this.#initialized = true;
			this.render();
		}
	}

	async render() {
		const template = await TEMPLATE_ROOT;
		const registration = await this.getRegistration();
		await Renderer.render({ container: this.root, template, data: { registration } });
	}

	get campaignid() {
		return parseInt(this.attr(ATTR__CAMPAIGNID));
	}

	get memberid() {
		return parseInt(this.attr(ATTR__MEMBERID));
	}

	async getRegistration() {
		const { campaignid, memberid } = this;
		return await getRegistrationByMember(campaignid, memberid);
	}
}

define(HTMLCampaignMemberElement);
export default HTMLCampaignMemberElement;
