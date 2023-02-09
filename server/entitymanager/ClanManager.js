import {CLANIDS} from "../Constants.js";
import DatabaseClient from "../utils/DatabaseClient.js";
import { getClanData } from "../wotservices/ClanService.js";

const TABLENAME = "clan";


const storeClan = async (clan) => {
    console.log("store clan", clan);
    const connection = await DatabaseClient.connection();

    await connection.query(`INSERT INTO ${TABLENAME} (id, name, clantag) VALUES ($1, $2, $3)
        ON CONFLICT (id) DO 
        UPDATE SET name = $2, clantag = $3`, [clan.id, clan.name, clan.tag]);

    await connection.commit();
    await connection.close();
}


export const getClan = async (accessToken, clanId) => {
    const connection = await DatabaseClient.connection();
    const clanData = await connection.query(`select * from ${TABLENAME} where ID = $1`, [clanId]);
    await connection.close();
    return clanData;
}

export const syncData = async (accessToken) => {
    const clanData =  await getClanData(accessToken, CLANIDS[0]);

    await storeClan(clanData)

};


