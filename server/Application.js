import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import { BASEPATH__API } from "./Constants.js";

const SERVERPORT = parseInt(process.env.SERVER_PORT) || 3000;
const SERVER = express();
const sessionConfig = {
	secret: "was auch immer hier als Password stehen könnte",
	cookie: {
		maxAge: 60*60*1000,
	},
	resave: true,
	saveUninitialized: false,
};

if (SERVER.get("env") === "production") {
	SERVER.set("trust proxy", 1); // trust first proxy
	sessionConfig.cookie.secure = true; // serve secure cookies
}

SERVER.use(session(sessionConfig));
SERVER.use(cookieParser());
SERVER.use(express.json()); // for parsing application/json
SERVER.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
SERVER.use(express.static("dist"));

const wrapHandle = (handle) => {
	return async (req, res, next) => {
		try {
			await handle(req, res);
		}catch(e){
			console.error("internal error", e);
			res.status(500).send("Something broke! Error: ", e.message);
		}
	}
};


export default {
	use(handle) {
		SERVER.use(handle);
	},
	get(path, handle) {
		SERVER.get(`${BASEPATH__API}${path}`, wrapHandle(handle));
		return this;
	},
	post(path, handle) {
		SERVER.post(`${BASEPATH__API}${path}`, wrapHandle(handle));
		return this;
	},
	put(path, handle) {
		SERVER.put(`${BASEPATH__API}${path}`, wrapHandle(handle));
		return this;
	},
	patch(path, handle) {
		SERVER.get(`${BASEPATH__API}${path}`, wrapHandle(handle));
		return this;
	},
	delete(path, handle) {
		SERVER.delete(`${BASEPATH__API}${path}`, wrapHandle(handle));
		return this;
	},
	listen() {
		SERVER.use((error, req, res, next) => {
			console.log("internal error", error);
			res.status(500).send("Something broke! Error: ", error.message);
		})
		SERVER.listen(SERVERPORT, () => console.log(`Example app is listening on port ${SERVERPORT}.`));
	},
};
