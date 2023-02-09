import DatabaseClient from "../utils/DatabaseClient.js";
import { getProfile } from "../wotservices/ProfileService.js";

const profileMapper = (profile) => {
	console.log(profile);
	return profile;
};

export const getMember = async (accessToken, accoundId ) => {
    const connection = await DatabaseClient.connection();
	const profile = await getProfile(accessToken, accoundId);
	const member = profileMapper(profile);

    await connection.close();
	return member;    
};

export const syncMemberData = async (accessToken, accoundIds) => {

};
