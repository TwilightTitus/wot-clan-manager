import DatabaseClient from "../utils/DatabaseClient.js";

const TABLENAME = "data";

const resultToData = (result) => {
    const data = [];
    for(let row of result.rows){
        row.payload = JSON.stringify(row.payload);
        data.push(row);
    }

	return data;
};

export const storeData = async ({id=null, type, payload}) => {
	const connection = await DatabaseClient.connection();
	
	const result = await (async () => {
		if(id)
			return await connection.query(`UPDATE ${TABLENAME} SET payload = $2 WHERE id = $1`,[id, JSON.stringify(payload)]);
		return await connection.query(`INSERT INTO ${TABLENAME} (type,payload) VALUES ($1, $2)`, [ type, JSON.stringify(payload)]);
	})();		

	const data = resultToData(result);

	await connection.commit();
	await connection.close();

	return data[0] || null;
};

export const deleteData = async (id) => {
	const connection = await DatabaseClient.connection();
	await connection.query(`DELETE FROM ${TABLENAME} WHERE id = $1`, [id]);

	await connection.commit();
	await connection.close();
};


export const getDataByType = async (type) => {
	const connection = await DatabaseClient.connection();
	const result = await connection.query(`SELECT * FROM ${TABLENAME} WHERE type = $1`, [type]);
	const data = resultToData(result);

	await connection.close();

    return data[0] || null;
}


export const getData = async (id) => {
	const connection = await DatabaseClient.connection();
	const result = await connection.query(`SELECT * FROM ${TABLENAME} WHERE id = $1`, [id]);
	
	const data = resultToData(result);
	
	await connection.close();

    return data[0] || null;
}
