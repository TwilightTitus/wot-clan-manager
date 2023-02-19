import DatabaseClient from "../utils/DatabaseClient.js";

const TABLENAME = "member";

export const storeMember = async (member) => {
	const { id, name, clanid, role, wtr } = member;
	const connection = await DatabaseClient.connection();
	await connection.query(
		`INSERT INTO ${TABLENAME} 
			(id,name,clanid,role,wtr) 
		VALUES 
			($1, $2, $3, $4, $5)
        ON CONFLICT (id) DO 
        UPDATE SET 
			name = $2, 
			clanid = $3, 
			role = $4, 
			wtr = $5`, 
		[id, name, clanid, role, wtr],
	);

	await connection.commit();
	await connection.close();
};

export const getAllMemberIds = async () => {
	const connection = await DatabaseClient.connection();

	const result = await connection.query(`select id from ${TABLENAME}`);
	const memberIds = result.rows;

	await connection.close();
	return memberIds;
};

export const getMembers = async () => {
	const connection = await DatabaseClient.connection();

	const result = await connection.query(`select * from ${TABLENAME}`);
	const members = result.rows;

	await connection.close();
	return members;
};

export const getMemberOfClan = async (clanId) => {
	if(typeof clanId !== "number")	return;

	const connection = await DatabaseClient.connection();

	const result = await connection.query(`select * from ${TABLENAME} where clanId = $1 order by name asc`, [clanId]);
	const members = result.rows;

	await connection.close();
	return members;
};

export const getMember = async (id) => {
	const connection = await DatabaseClient.connection();

	const result = await connection.query(`select * from ${TABLENAME} where id = $1`, [id]);
	const member = result.rows[0];
	
	await connection.close();
	return member;
};
