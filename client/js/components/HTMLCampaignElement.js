import { TEMPLATE_BASEPATH, EVENT__GLOBAL_ACTION_RELOADPARENT } from "../Constants.js";
import { Component, define } from "@default-js/defaultjs-html-components";
import { Renderer, Template } from "@default-js/defaultjs-template-language";
import { getCampaign, deleteCampaign, storeCampaign } from "../services/CampaignService.js";
import { getRegistrations, getMyRegistration, getRegistrationByMember, storeRegistration } from "../services/CampaignRegistrationService.js";
import { storeTeam } from "../services/TeamService.js";
import "@default-js/defaultjs-html-form";

const TEMPLATES_PATH = `${TEMPLATE_BASEPATH}/html-campaign-element`;
export const NODENAME = "x-campaign";
const ATTR__CAMPAIGNID = "campaign-id";

const TEMPLATE_ROOT = Template.load(new URL(`${TEMPLATES_PATH}/root.tpl.html`, location));
const TEMPLATE_REGISTRATION = Template.load(new URL(`${TEMPLATES_PATH}/registration.tpl.html`, location));


const getDatesBetweenTwoDates = (a, b) => {
	a = a instanceof Date ? a : new Date(a);
	b = b instanceof Date ? b : new Date(b);

	const days = Math.ceil(Math.abs(a - b) / (1000 * 60 * 60 * 24));
	const dates = [];
	for (let i = 0; i < days; i++)
		dates.push(a.addDays(i));

	return dates;
};

class HTMLCampaignElement extends Component {
	static get NODENAME() {
		return NODENAME;
	}

	#initialized = false;

	constructor() {
		super();
		const root = this.root;
		root.on(EVENT__GLOBAL_ACTION_RELOADPARENT, (event) => {
			event.stopPropagation();
			this.render();
		});
		root.on("action:delete-campaign", (event) => {
			event.stopPropagation();
			(async () => {
				await deleteCampaign(this.campaignId);
				this.remove();
			})();
		});
		root.on("action:create-team", (event) => {
			event.stopPropagation();
			(async () => {
				const campaignId = this.campaignId;
				const team = await storeTeam({ name: "neues Team", campaignid: campaignId });
				const campaign = await getCampaign(campaignId);
				campaign.payload = campaign.payload || {};
				campaign.payload.teams = campaign.payload.teams || [];
				const teams = campaign.payload.teams;
				teams.push(team.id);

				await storeCampaign(campaign);

				this.render();
			})();
		});
		root.on("info:team-deleted", (event) => {
			event.stopPropagation();
			const teamId = event.detail;
			(async () => {
				const campaign = await getCampaign(this.campaignId);
				const teams = campaign.payload.teams;
				teams.splice(teams.indexOf(teamId), 1);
				await storeCampaign(campaign);
			})();
		});
		root.on("action:member-registrate", (event) => {
			event.stopPropagation();
			this.openRegistrationDialog();
		});
	}

	async init() {
		await super.init();
		if (!this.#initialized) {
			await this.render();
			this.#initialized = true;
		}
	}

	get campaignId() {
		return parseInt(this.attr(ATTR__CAMPAIGNID));
	}

	async render() {
		const template = await TEMPLATE_ROOT;
		await Renderer.render({ container: this.root, template, data: { campaign: await getCampaign(this.campaignId) } });
	}

	async openRegistrationDialog() {
		const template = await TEMPLATE_REGISTRATION;
		const campaign = await getCampaign(this.campaignId);

	const data= {
		campaign,
		days: getDatesBetweenTwoDates(campaign.startdate, campaign.enddate),
	};

		const result = await Renderer.render({
			template,
			container: this.root,
			data,
			mode: "append"			
		});

		const dialog = result.content[0];
		const form = dialog.find("d-form").first();

		form.on("d-form-submit", (event) => {
			console.log(event);
			event.stopPropagation();
			(async () => {
				const registration = await form.value();
				console.log(registration);
				await storeRegistration(this.campaignId, {
					fullyavailable : (() => {
						for(const day in registration){
							if(registration[day] == "full")
								return false;
							return true;
						}					
					})(),
					availability: registration
				});
				dialog.hide();
				dialog.remove();
			})();
		});
		form.on("action:close-registration-dialog", (event) => {
			event.stopPropagation();
			dialog.hide();
			dialog.remove();
		});

		dialog.showModal();
	}
}

define(HTMLCampaignElement);
export default HTMLCampaignElement;
