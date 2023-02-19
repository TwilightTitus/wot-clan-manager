import { TEMPLATE_BASEPATH } from "../Constants.js";
import { Component, define } from "@default-js/defaultjs-html-components";
import { Renderer, Template } from "@default-js/defaultjs-template-language";

export const NODENAME = "x-clan";
export const ATTR__CLAN_ID = "clan-id";
export const ATTR__CLAN_NAME = "clan-name";
export const ATTR__CLAN_TAG = "clan-tag";

const TEMPLATE_URL__ROOT = new URL(`${TEMPLATE_BASEPATH}/html-clan-element/root.tpl.html`, location);

class HTMLClanElement extends Component {
	static get NODENAME() {
		return NODENAME;
	}

	#initialized = false;
	#clan = null;

	constructor() {
		super();
		this.on(`${NODENAME}:sort-member-by-name`, () => {});
		this.on(`${NODENAME}:sort-member-by-wtr`, () => {});
	}

	async init() {
		await super.init();
		if (!this.#initialized) {
			const template = await Template.load(TEMPLATE_URL__ROOT);
			await Renderer.render({ container: this.root, template, data: await this.clanData() });
		}
	}

	async clanData() {
		if (!this.#clan) {
			this.#clan = {
				id: this.attr(ATTR__CLAN_ID),
				name: this.attr(ATTR__CLAN_NAME),
				tag: this.attr(ATTR__CLAN_TAG),
			};

			const response = await fetch(new URL(`/api/clans/${this.#clan.id}/members`, location));
			const data = await response.json();
			this.#clan.members = data.members;
		}

		return this.#clan;
	}
}

define(HTMLClanElement);
export default HTMLClanElement;
