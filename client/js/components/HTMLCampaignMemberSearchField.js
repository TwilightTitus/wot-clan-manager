import { TEMPLATE_BASEPATH, EVENT__GLOBAL_ACTION_RELOADPARENT } from "../Constants.js";
import { define } from "@default-js/defaultjs-html-components";
import { BaseField } from "@default-js/defaultjs-html-form";
import { Renderer, Template } from "@default-js/defaultjs-template-language";
import { getRegistrations } from "../services/CampaignRegistrationService.js";

const ATTR_CAMPAIGNID = "campaign-id";
const NODENAME = "x-campaign-member-search-field";
const TEMPLATES_PATH = `${TEMPLATE_BASEPATH}/html-campaign-member-search-field-element`;
const TEMPLATE_ROOT = Template.load(new URL(`${TEMPLATES_PATH}/root.tpl.html`, location));
const TEMPLATE_DIALOG = Template.load(new URL(`${TEMPLATES_PATH}/dialog.tpl.html`, location));

class HTMLCampaignMemberSearchFieldElement extends BaseField {
	static get NODENAME() {
		return NODENAME;
	}

	#initialized = false;
	#registrations = null;
	#selectionDialog = null;

	constructor() {
		super();

		const root = this.root;
		root.on("action:show-selection-dialog", (event) => {
			event.stopPropagation();
			if(!this.readonly)		
				this.showSelectionDialog();
		});
		root.on("action:save-selection", (event) => {
			event.stopPropagation();
			if(!this.readonly){
				(async () => {
					const selections = this.#selectionDialog.find(".is-selected x-campaign-member");
					const memberids = await Promise.all(selections.map(async (selected) => (await selected.getRegistration()).memberid));
					await this.publishValue(memberids);					
					await this.render();
					this.#selectionDialog.close();
					this.#selectionDialog.remove();
					this.#selectionDialog = null;
				})();
			}
		});
	}

	async init() {
		await super.init();
		if (!this.#initialized) {
			this.#registrations = await getRegistrations(this.campaignid);
			this.render();
		}
	}

	async showSelectionDialog() {
		if(!this.#selectionDialog){
			const {root} = this;
			const template = await TEMPLATE_DIALOG;
			const memberids = await (async () => {
				const result = new Set();
				const memberids = await this.value();
				if (memberids) {
					for (const memberid of memberids)
						result.add(memberid);
				}
				return result;
			})();
			await Renderer.render({ template, container: root, data: { registrations: this.#registrations, memberids, campaignid: this.campaignid }, mode:"append"});	
			this.#selectionDialog = root.find(":scope > dialog").first();
			
		}
		this.#selectionDialog.showModal(); 
	}

	async render(value) {
		value = value || await this.value();
		const template = await TEMPLATE_ROOT;
		Renderer.render({ template, container: this.root, data: { memberids: value || [], campaignid: this.campaignid } });
	}

	get campaignid() {
		return parseInt(this.attr(ATTR_CAMPAIGNID));
	}

	async acceptValue(value) {
		return value instanceof Array || value == null;
	}

	async readonlyUpdated() {}

	async updatedValue(value) {
		if(this.#selectionDialog)
			this.#selectionDialog.remove()
		
		await this.render(value);
	}
}

define(HTMLCampaignMemberSearchFieldElement);
export default HTMLCampaignMemberSearchFieldElement;
