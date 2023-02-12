import DatabaseClient from "../utils/DatabaseClient.js";

const TABLENAME = "clan";


export const storeClan = async (clan) => {
    const connection = await DatabaseClient.connection();

    await connection.query(`INSERT INTO ${TABLENAME} (id, name, clantag) VALUES ($1, $2, $3)
        ON CONFLICT (id) DO 
        UPDATE SET name = $2, clantag = $3`, [clan.id, clan.name, clan.tag]);

    await connection.commit();
    await connection.close();
}


export const getClan = async (clanId) => {
    const connection = await DatabaseClient.connection();
    const result = await connection.query(`select * from ${TABLENAME} where ID = $1`, [clanId]);
    const clan = result[0];
    await connection.close();
    return clan;
}

export const getClans = async () => {
    const connection = await DatabaseClient.connection();
    const result = await connection.query(`select * from ${TABLENAME}`);
    const clans = result.rows;

    await connection.close();
    return clans;
}


