import DatabaseClient from "../utils/DatabaseClient.js";

const TABLENAME = "TEAM";

const resultToData = (result) => {
    const data = [];
    for(let row of result.rows){
        row.payload = JSON.stringify(row.payload);
        data.push(row);
    }

	return data;
};

export const storeTeam = async ({ id = null, name, type = null, payload = {} }) => {
	const connection = await DatabaseClient.connection();

	const result = await (async () => {
		if (id)
			return await connection.query(
				`UPDATE ${TABLENAME} SET 
                name = $2,
                type = $3,
                payload = $4 
                WHERE id = $1 RETURNING *`,
				[id, name, type, JSON.stringify(payload)],
			);
		return await connection.query(
			`INSERT INTO ${TABLENAME} 
            (name, type ,payload) 
            VALUES 
            ($1, $2, $3) RETURNING *`,
			[name, type, JSON.stringify(payload)],
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


export const getTeamsByType = async (type = null) => {
	const connection = await DatabaseClient.connection();
	const result = await connection.query(`SELECT * FROM ${TABLENAME} WHERE type = $1`, [type]);
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
