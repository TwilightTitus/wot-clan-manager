import { PAGEURL, URL_LOGIN, URL_ACCESS } from "../Constants.js";
const SECOND = 1000;
const MINUTE = 60 * SECOND;

let isloggedIn = false;
let ACCESSRIGHT = {};
let MEMBER;
let ACCESSTOKEN;
let EXPIREAT;

const access = async () => {
	let response = await fetch(new URL(URL_ACCESS, location));
	if (response.status == 401) return false;
	if (response.status == 403) return null;

	response = await response.json();
	const { member, accessToken, expireAt, accessRights } = response;
	MEMBER = member;
	ACCESSTOKEN = accessToken;
	EXPIREAT = expireAt;
	ACCESSRIGHT = accessRights;

    scheduleNexAccessTokenRefresh();

	return true;
};

const scheduleNexAccessTokenRefresh = () => {
	const timeOffset = EXPIREAT - (Date.now() + MINUTE);

	setTimeout(async () => {
		await access();		
	}, timeOffset);
};

export const login = async () => {
	if (!isloggedIn) {
		if (!await access()){
             location.href = new URL(URL_LOGIN, location).toString();
             return null;
        }

		isloggedIn = true;
	}

	return MEMBER;
};

export const fullAccessData = () => {
	return {
		accessToken :ACCESSTOKEN,
		expireAt : EXPIREAT,
		member : MEMBER,
		accessRights: ACCESSRIGHT
	}
}

export const accessRights = () => {
	return  ACCESSRIGHT;
}

export const member = () => {
	return MEMBER;
}

export const accessToken = () => {
    return ACCESSTOKEN;
}
