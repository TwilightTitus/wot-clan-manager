import DatabaseClient from "../utils/DatabaseClient.js";

const TABLENAME = "CAMPAIGNREGISTRATION";

const resultToData = (result) => {
	const data = [];
	for (let row of result.rows) {
		console.log({ row });
		row.availability = row.availability ? JSON.parse(row.availability) : null;
		data.push(row);
	}

	return data;
};

export const storeCampaignRegistration = async ({ campaignid, memberid, fullyavailable = false, availability = {} }) => {
	console.log("store registration", { campaignid, memberid, fullyavailable, availability })
	const connection = await DatabaseClient.connection();
	const result = await (async () => {
		const result = await connection.query(
				`UPDATE ${TABLENAME} SET                  
                fullyavailable = $3, 
                availability = $4 
                WHERE campaignid = $1 AND memberid = $2 RETURNING *`,
				[campaignid, memberid, fullyavailable, JSON.stringify(availability)],
			);
		if(result.rowCount == 1)
			return result;
		
			return connection.query(
			`INSERT INTO ${TABLENAME} 
            (campaignid, memberid, fullyavailable, availability) 
            VALUES 
            ($1, $2, $3, $4) RETURNING *`,
			[campaignid, memberid, fullyavailable, JSON.stringify(availability)],
		);
	})();
	const registrations = resultToData(result);

	await connection.commit();
	await connection.close();

	return registrations[0] || null;
};

export const deleteCampaignRegistration = async (campaignId, memberid) => {
	const connection = await DatabaseClient.connection();
	await connection.query(`DELETE FROM ${TABLENAME} WHERE campaignid = $1 and memberid = $2`, [campaignId, memberid]);

	await connection.commit();
	await connection.close();
};

export const getCampaignRegistrations = async (campaignId) => {
	const connection = await DatabaseClient.connection();
	const result = await connection.query(`SELECT * FROM ${TABLENAME} WHERE campaignId = $1`, [campaignId]);

	const registrations = resultToData(result);

	await connection.close();

	return registrations;
};

export const getCampaignRegistration = async (campaignId, memberId) => {
	const connection = await DatabaseClient.connection();
	const result = await connection.query(`SELECT * FROM ${TABLENAME} WHERE campaignId = $1 and memberid = $2`, [campaignId, memberId]);
	const registrations = resultToData(result);

	await connection.close();

	return registrations[0] || null;
};
