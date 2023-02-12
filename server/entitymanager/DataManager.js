import DatabaseClient from "../utils/DatabaseClient.js";

const TABLENAME = "data";


export const storeData = async (id, data) => {
	const connection = await DatabaseClient.connection();
	await connection.query(
		`INSERT INTO ${TABLENAME} 
			(id,payload) 
		VALUES 
			($1, $2)
        ON CONFLICT (id) DO 
        UPDATE SET  
            payload = $2`, 
		[id, JSON.stringify(data)]
	);

	await connection.commit();
	await connection.close();
};

export const deleteData = async (id) => {
	const connection = await DatabaseClient.connection();
	await connection.query(`delete from ${TABLENAME} where id = $1`, [id]);

	await connection.commit();
	await connection.close();
};


export const getData = async (id) => {
	const connection = await DatabaseClient.connection();
	const result = await connection.query(`SELECT * FROM ${TABLENAME} WHERE id = $1`, [id]);
    const row = result.rows[0];        

	await connection.commit();
	await connection.close();

    return row ? JSON.parse(row.payload) : null;
}
