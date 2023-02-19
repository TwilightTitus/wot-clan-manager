import { TEMPLATE_BASEPATH, EVENT__GLOBAL_ACTION_RELOADPARENT } from "../Constants.js";
import { Component, define } from "@default-js/defaultjs-html-components";
import { Renderer, Template } from "@default-js/defaultjs-template-language";
import { getTeam, deleteTeam, storeTeam } from "../services/TeamService.js";
import "@default-js/defaultjs-html-form";

const TEMPLATES_PATH = `${TEMPLATE_BASEPATH}/html-team-element`;

const NODENAME = "x-team";
const ATTR__TEAMID = "team-id";
const ATTR__CAMPAIGNID = "campaign-id";

const TEMPLATE__ROOT = Template.load(new URL(`${TEMPLATES_PATH}/root.tpl.html`, location));

class HTMLTeamElement extends Component {
	static get NODENAME() {
		return NODENAME;
	}

	#initialized = false;

	constructor() {
		super();
		const root = this.root;
		root.on("action:delete-team", (event) => {
			event.stopPropagation();
			(async () => {
				const teamId = this.teamId;
				await deleteTeam(teamId);				
				this.trigger("info:team-deleted", teamId);
                this.remove();
			})();
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

    get campaignId(){
        return parseInt(this.attr(ATTR__CAMPAIGNID))
    }

	async render() {
		const template = await TEMPLATE__ROOT;
		await Renderer.render({ template, container: this.root, data: { team: await getTeam(this.teamId) } });
	}
}

define(HTMLTeamElement);
export default HTMLTeamElement;
