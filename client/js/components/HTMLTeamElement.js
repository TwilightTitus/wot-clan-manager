import { TEMPLATE_BASEPATH, EVENT__GLOBAL_ACTION_RELOADPARENT } from "../Constants.js";
import { Component, define } from "@default-js/defaultjs-html-components";
import { Renderer, Template } from "@default-js/defaultjs-template-language";
import { getTeam, deleteTeam, storeTeam } from "../services/TeamService.js";
import { accessRights } from "../services/LoginService.js";
import "@default-js/defaultjs-html-form";

const TEMPLATES_PATH = `${TEMPLATE_BASEPATH}/html-team-element`;

const NODENAME = "x-team";
const ATTR__TEAMID = "team-id";
const ATTR__CAMPAIGNID = "campaign-id";

const TEMPLATE__ROOT = Template.load(new URL(`${TEMPLATES_PATH}/root.tpl.html`, location));
const TEMPLATE__EDITOR = Template.load(new URL(`${TEMPLATES_PATH}/editor.tpl.html`, location));

class HTMLTeamElement extends Component {
	static get NODENAME() {
		return NODENAME;
	}

	#initialized = false;
	#open = false;

	constructor() {
		super();
		const root = this.root;
		root.on("action:toogle-details", (event) => {
			event.stopPropagation();
			const {target} = event;
			if (target instanceof HTMLDetailsElement) 
				this.#open = target.open;
		});
		root.on("action:delete-team", (event) => {
			event.stopPropagation();
			(async () => {
				const teamId = this.teamId;
				await deleteTeam(teamId);
				this.trigger("info:team-deleted", teamId);
				this.remove();
			})();
		});

		root.on("action:edit-team", (event) => {
			event.stopPropagation();
			this.editorDialog();
		});
	}

	async init() {
		await super.init();
		if (!this.#initialized) {
			await this.render();
			this.#initialized = true;
		}
	}

	get teamId() {
		return parseInt(this.attr(ATTR__TEAMID));
	}

	get campaignId() {
		return parseInt(this.attr(ATTR__CAMPAIGNID));
	}

	async render() {
		const template = await TEMPLATE__ROOT;
		await Renderer.render({ template, container: this.root, data: {accessRights: accessRights(), open: this.#open, team: await getTeam(this.teamId) } });
	}

	async editorDialog() {
		const { root, teamId } = this;
		const team = await getTeam(teamId);
		const template = await TEMPLATE__EDITOR;
		const container = document.createElement("div");
		await Renderer.render({ container, template, data: { team } });
		root.append(container.innerHTML);
		const dialog = root.find(":scope > dialog").last();
		dialog.on("d-form-submit", (event) => {
			event.stopPropagation();
			const form = event.target;
			(async () => {
				const team = await form.value();
				await storeTeam(team);
				dialog.close();
				dialog.remove();
				this.render();
			})();
		});
		dialog.on("close", (event) => {
			event.stopPropagation();
			dialog.remove();
		});

		const form = dialog.find("d-form").first();
		await form.ready;
		await form.value(team);
		dialog.showModal();
	}
}

define(HTMLTeamElement);
export default HTMLTeamElement;
