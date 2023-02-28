import { TEMPLATE_BASEPATH, EVENT__GLOBAL_ACTION_RELOADPARENT } from "../Constants.js";
import { Component, define } from "@default-js/defaultjs-html-components";
import { Renderer, Template } from "@default-js/defaultjs-template-language";
import { getMember } from "../services/MemberService.js";

const TEMPLATES_PATH = `${TEMPLATE_BASEPATH}/html-member-element`
export const NODENAME = "x-member";
const ATTR__MEMBERID = "member-id";

const TEMPLATE_ROOT = Template.load(new URL(`${TEMPLATES_PATH}/root.tpl.html`, location));

class HTMLMemberElement extends Component {
	static get NODENAME() {
		return NODENAME;
	}

	#initialized = false;

	constructor() {
		super();
		const root = this.root;
		
	}

	async init() {
		await super.init();
		if (!this.#initialized) {
			await this.render();
            this.#initialized = true;
		}
	}

	get memberId(){
		return parseInt(this.attr(ATTR__MEMBERID));
	}

    async render() {
        const template = await TEMPLATE_ROOT;
		const member = await getMember(this.memberId);
		await Renderer.render({ container: this.root, template, data: {member} });
    }
}

define(HTMLMemberElement);
export default HTMLMemberElement;
