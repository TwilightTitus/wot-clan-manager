import { PAGEURL, WOTAPPID } from "../Constants.js";

const PARAM__ACCESSTOKEN = "access_token";
const PARAM__EXPIRESAT = "expires_at";
const PARAM__USERNAME = "nickname";
const PARAM__ID = "account_id";

const USER = {
	accessToken: PAGEURL.searchParams.get(PARAM__ACCESSTOKEN),
	expiresAt: PAGEURL.searchParams.get(PARAM__EXPIRESAT),
	username: PAGEURL.searchParams.get(PARAM__USERNAME),
	id: PAGEURL.searchParams.get(PARAM__ID),
};

const redirectToLogin = ({ appid }) => {
	const url = new URL("https://api.worldoftanks.eu/wot/auth/login/");
	url.searchParams.set("application_id", appid);
	url.searchParams.set("display", "page");
	url.searchParams.set("nofollow", "0");

    PAGEURL.searchParams.delete(PARAM__ACCESSTOKEN);
    PAGEURL.searchParams.delete(PARAM__EXPIRESAT);
    PAGEURL.searchParams.delete(PARAM__USERNAME);
    PAGEURL.searchParams.delete(PARAM__ID);

	url.searchParams.set("redirect_uri", PAGEURL.toString());
	location.href = url.toString();
};

const scheduleNexAccessTokenRefresh = ({appid}) => {
    setTimeout(() => {
        refreshAccessToken({appid})
    }, Date.now() - USER.expiresAt - (60 * 1000));
}

const refreshAccessToken = async ({appid}) => {
    const url = new URL("https://api.worldoftanks.eu/wot/auth/prolongate/");

    const data = new FormData();
    data.append("application_id", appid);
	data.append("access_token", USER.accessToken);

    let response = await fetch(url, {method:"post", body: data});
    response = await response.json();

    if(response.status != "ok" || !response?.data)
        redirectToLogin({appid});
    
    USER.accessToken = response.data.access_token;
    USER.expiresAt = response.data.expires_at;

    scheduleNexAccessTokenRefresh({appid})

};

let isloggedIn = false;

export const login = ({ appid = WOTAPPID } = {}) => {
	if (!isloggedIn) {
		if (!USER.accessToken) redirectToLogin({ appid });
        if (USER.expiresAt >= Date.now()) redirectToLogin({ appid });

        scheduleNexAccessTokenRefresh({appid});

		isloggedIn = true;
	}

	return USER;
};
