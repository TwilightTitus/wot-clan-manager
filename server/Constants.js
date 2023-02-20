export const APPLICATIONID="60b6849d65c6bc2c3241fef518a8e907";
export const BASEPATH__API = "/api";
export const CLANIDS = [500056248]
export const ALLOWED_MANAGEMENT = ["commander", "executive_officer", "personnel_officer", "combat_officer"];

export const API_SYSTEM = "/system";
export const API_SYSTEM_LOGIN = `${API_SYSTEM}/login`;
export const API_SYSTEM_ACCESS = `${API_SYSTEM}/access`;


export const API_MANAGEMENT = `/management`;

export const LOGIN_CHECK__IGRNORED_PATHS = [`${BASEPATH__API}${API_SYSTEM_LOGIN}`,`${BASEPATH__API}${API_SYSTEM_ACCESS}`];

export const WOT_ENDPOINT_BASE = "https://api.worldoftanks.eu";
export const WOT_ENDPOINT_LOGIN = `${WOT_ENDPOINT_BASE}/wot/auth/login/`;
export const WOT_ENDPOINT_LOGIN_REFESH = `${WOT_ENDPOINT_BASE}/wot/auth/prolongate/`;