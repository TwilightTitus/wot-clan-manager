import DatabaseClient from "../utils/DatabaseClient.js";

const TABLENAME = "TEAM";

const resultToData = (result) => {
    const data = [];
    for(let row of result.rows){
        row.payload = row.payload ? JSON.parse(row.payload) : null;
        data.push(row);
    }

	return data;
};

export const storeTeam = async ({ id = null, name, campaignid = null, payload = {} }) => {
	const connection = await DatabaseClient.connection();

	const result = await (async () => {
		if (id)
			return await connection.query(
				`UPDATE ${TABLENAME} SET 
                name = $2,
                campaignid = $3,
                payload = $4 
                WHERE id = $1 RETURNING *`,
				[id, name, campaignid, JSON.stringify(payload)],
			);
		return await connection.query(
			`INSERT INTO ${TABLENAME} 
            (name, campaignid, payload) 
            VALUES 
            ($1, $2, $3) RETURNING *`,
			[name, campaignid, JSON.stringify(payload)],
		);
	})();

    const teams = resultToData(result);

	await connection.commit();
	await connection.close();

	return teams[0] || null;
};

export const deleteTeam = async (id) => {
	const connection = await DatabaseClient.connection();
	await connection.query(`DELETE FROM ${TABLENAME} WHERE id = $1`, [id]);

	await connection.commit();
	await connection.close();
};


export const getTeams = async ({campaignid}) => {
	const connection = await DatabaseClient.connection();	
	const result = await ( () => {
		if(typeof campaignid === "number")
			return connection.query(`SELECT * FROM ${TABLENAME} WHERE campaignid = $1`, [campaignid]);
		return connection.query(`SELECT * FROM ${TABLENAME}`);
	})();
	
    const teams = resultToData(result);

	await connection.close();

	return teams || null;
};

export const getTeam = async (id) => {
	const connection = await DatabaseClient.connection();
	const result = await connection.query(`SELECT * FROM ${TABLENAME} WHERE id = $1`, [id]);
	const teams = resultToData(result);

	await connection.commit();
	await connection.close();

	return teams[0] || null;
};
