import { Component, define } from "@default-js/defaultjs-html-components";
import { Renderer, Template } from "@default-js/defaultjs-template-language";
import { login, accessToken } from "../services/LoginService.js";

export const NODENAME = "x-login-component";
const ATTR_TEMPLATE = "template";

class WotLoginComponent extends Component {
	static get NODENAME() {
		return NODENAME;
	}

	constructor() {
		super();
	}

	async init() {
		await super.init();
		const user = await login();
		if (user) {
			const attrTemplate = this.attr(ATTR_TEMPLATE);
			if (attrTemplate) {
				const template = await Template.load(new URL(attrTemplate, location));
				await Renderer.render({ container: this, data: { user }, template });
			}
		}
		else{
			this.textContent = "kein Zugriff erlaubt";
		}
		
	}
}

define(WotLoginComponent);

export default WotLoginComponent;
