import DatabaseClient from "../utils/DatabaseClient.js";
import Filter, {SORTING_ASC, SORTING_DESC} from "../database/Filter.js";

const TABLENAME = "MESSAGE";

export const MESSAGE_TYPE__NOTIFICATION = "notification";
export const MESSAGE_TYPE__MEMBER = "member";

export class MessageFilter extends Filter {
	constructor({page = 1, size = 10, sorting = SORTING_ASC} = {}){
		super({page, size , sorting, sortBy: ["updated"]})
	}
}

const DEFAULT_MESSAGEFILTER = new MessageFilter();

export const storeMessage = async ({id=null, type, reference, memberid, text}) => {
	const connection = await DatabaseClient.connection();
	
	const result = await (async () => {
		if(id)
			return await connection.query(`UPDATE ${TABLENAME} SET 
				text = $3, 
				updated = $4 
				WHERE id = $1 AND memberid = $2 
				RETURNING *`,[id, memberid, text, new Date()]);

		return await connection.query(`INSERT INTO ${TABLENAME} 
			(type, reference, memberid, text) 
			VALUES ($1, $2, $3, $4) 
			RETURNING *`, [ type, reference, memberid, text]);
	})();		

	const data = result.rows;

	await connection.commit();
	await connection.close();

	return data[0] || null;
};

export const deleteMessage = async ({id}) => {
	const connection = await DatabaseClient.connection();
	await connection.query(`DELETE FROM ${TABLENAME} WHERE id = $1`, [id]);

	await connection.commit();
	await connection.close();
};

export const getMessages = async ({type, reference, filter = DEFAULT_MESSAGEFILTER}) => {
	const connection = await DatabaseClient.connection();
	const result = await connection.query(`SELECT * FROM ${TABLENAME} WHERE type = $1 ${typeof reference === "number" ? "AND reference = $2" : ""} ${filter instanceof MessageFilter ? filter.sql : ""}`, [type, reference]);
	const data = result.rows;

	await connection.close();

    return data || null;
}

export const getMessage = async ({id}) => {
	const connection = await DatabaseClient.connection();
	const result = await connection.query(`SELECT * FROM ${TABLENAME} WHERE id = $1`, [id]);
	const data = result.rows;

	await connection.close();

    return data[0] || null;
}