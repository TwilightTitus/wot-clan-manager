import DatabaseClient from "../utils/DatabaseClient.js";

const TABLENAME = "CAMPAIGN";

const resultToData = (result) => {
    const data = [];
    for(let row of result.rows){
		console.log({row})
        row.payload = JSON.stringify(row.payload);
        data.push(row);
    }

	return data;
};

export const storeCampaign = async ({ id = null, name, startDate, endDate, payload = {} }) => {
	const connection = await DatabaseClient.connection();
	const result = await (async () => {
		if (id)
			return await connection.query(
				`UPDATE ${TABLENAME} SET 
                name = $2, 
                startDate = $3, 
                endDate = $4, 
                payload = $5 
                WHERE id = $1 RETURNING *`,
				[id, name, startDate, endDate, JSON.stringify(payload)],
			);
		return await connection.query(
			`INSERT INTO ${TABLENAME} 
            (name, startDate, endDate, payload) 
            VALUES 
            ($1, $2, $3, $4) RETURNING *`,
			[name, startDate, endDate, JSON.stringify(payload)],
		);
	})();
	console.log({result});
	const campaigns = resultToData(result);

	await connection.commit();
	await connection.close();

	return campaigns[0] || null;
};

export const deleteCampaign = async (id) => {
	const connection = await DatabaseClient.connection();
	await connection.query(`DELETE FROM ${TABLENAME} WHERE id = $1`, [id]);

	await connection.commit();
	await connection.close();
};

export const getCampaigns = async () => {
	const connection = await DatabaseClient.connection();
	const result = await connection.query(`SELECT * FROM ${TABLENAME} ORDER BY startDate DESC`);

	const campaigns = resultToData(result);

	await connection.close();

	return campaigns;
};

export const getCampaign = async (id) => {
	const connection = await DatabaseClient.connection();
	const result = await connection.query(`SELECT * FROM ${TABLENAME} WHERE id = $1`, [id]);
	const campaigns = resultToData(result);

	await connection.close();

	return campaigns[0] || null;
};
