import DatabaseClient from "../utils/DatabaseClient.js";

const TABLENAME = "data";


export const storeData = async ({id=null, type, payload}) => {
	const connection = await DatabaseClient.connection();
	
	const result = await (async () => {
		if(id)
			return await connection.query(`UPDATE ${TABLENAME} SET payload = $2 WHERE id = $1`,[id, JSON.stringify(payload)]);
		return await connection.query(`INSERT INTO ${TABLENAME} (type,payload) VALUES ($1, $2)`, [ type, JSON.stringify(payload)]);
	})();		

	const row = result.rows[0];
	if(row)
		row.payload = JSON.parse(row.payload);

	await connection.commit();
	await connection.close();

	return row || null;
};

export const deleteData = async (id) => {
	const connection = await DatabaseClient.connection();
	await connection.query(`delete from ${TABLENAME} where id = $1`, [id]);

	await connection.commit();
	await connection.close();
};


export const getDataByType = async (type) => {
	const connection = await DatabaseClient.connection();
	const result = await connection.query(`SELECT * FROM ${TABLENAME} WHERE type = $1`, [type]);
    const row = result.rows[0];
	if(row)
		row.payload = JSON.parse(row.payload);


	await connection.commit();
	await connection.close();

    return row || null;
}


export const getData = async (id) => {
	const connection = await DatabaseClient.connection();
	const result = await connection.query(`SELECT * FROM ${TABLENAME} WHERE id = $1`, [id]);
    if(row)
		row.payload = JSON.parse(row.payload);    

	await connection.commit();
	await connection.close();

    return row || null;
}
