import "@default-js/defaultjs-httpinterceptor";
import Manager from "@default-js/defaultjs-httpinterceptor/src/Manager.js";
import Interceptor from "@default-js/defaultjs-httpinterceptor/src/Interceptor.js";
import { accessToken } from "./services/LoginService.js";

export default class AuthInterceptor extends Interceptor {
	constructor() {
		super();
	}

	async doAccept(data) {
		return location.origin == data.metadata.origin;
	}

	async doHandle(data) {
		const token = accessToken();
		if (token) {
			data.request.headers = data.request.headers || {};
			data.request.headers["Authorization"] = `Bearer ${token}`;
		}
		return data;
	}
}

Manager.addInterceptor(new AuthInterceptor());
