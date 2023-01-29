import fileservice from "fs/promises";
import { connect } from "http2";
import {DEFAULTDIR, DEFAULTTABLENAME} from "./Constants.js"

const FILENAME_SPLIT = /(V)(\d+\.\d+\.\d+)-([^\.]+)\.(js|sql)/i;
const STATEMENT__CHECKTABLE = `select * from ${DEFAULTTABLENAME} where id = 0`;
const STATEMENT__CREATEMIGRATIONTABLE = 
`CREATE TABLE ${DEFAULTTABLENAME} (
    id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    name VARCHAR NOT NULL,
    version VARCHAR NOT NULL,
    type VARCHAR NOT NULL,
    executed timestamptz NOT NULL DEFAULT NOW()
)`;

const STATEMENT__IS_FILE_EXECUTED = `SELECT * FROM ${DEFAULTTABLENAME} WHERE name = $1`;
const STATEMENT__INSERT_EXECUTED_FILE = `INSERT INTO ${DEFAULTTABLENAME} (title, name, version, type) VALUES ($1, $2, $3, $4)`;


const toFileparts = (filename) => {
    const match = FILENAME_SPLIT.exec(filename);
    const [name, type, version, title, extention] = match;
    return {
        name, 
        type, 
        version, 
        title, 
        extention : extention.toLowerCase()
    };
}


const initTable = async (connection) => {
    if(! await checkIfTableExists(connection))
        await createMigrationTable(connection);
}

const checkIfTableExists = async (connection) => {
    try{
        await connection.query(STATEMENT__CHECKTABLE);
        return true;
    }catch(e){
        await connection.rollback();
        return false;
    }
}

const createMigrationTable = async (connection) => {
    await connection.query(STATEMENT__CREATEMIGRATIONTABLE);
    await connection.commit();
}

const isFileExecuted = async (file, connection) => {
    const result = await connection.query(STATEMENT__IS_FILE_EXECUTED, [file.name]);
    return result.rowCount != 0;
}


export default class MigrationTool {
    #databaseClient;

    constructor(databaseClient){
        this.#databaseClient = databaseClient;
    }

    async migrate(){
        const connection = await this.#databaseClient.connection();
        await initTable(connection);

        let files = await fileservice.readdir(DEFAULTDIR);
        for(let file of files){
            if(file != "." && file != "..")
                await this.#processFile(file, connection);
        }
    }

    async #processFile(file, connection){
        file = toFileparts(file);
        
        if(await isFileExecuted(file, connection))
            return;

        if(file.extention == "sql")
            await this.#processSqlFile(file, connection);
        else if(file.extention == "js")
            await this.#processJsFile(file, connection);


        await connection.query(STATEMENT__INSERT_EXECUTED_FILE, [file.title, file.name, file.version, file.type]);
        connection.commit();

        
        console.log("db migration file executed: ", file.name);
       
    }

    async #processSqlFile(file, connection) {
        const sql = (await fileservice.readFile(`${DEFAULTDIR}/${file.name}`)).toString();
        await connection.query(sql);
    }

    async #processJsFile(file, connection){
        const realPath = await fileservice.realpath(`${DEFAULTDIR}/${file.name}`);
        const {default: migrateFn} = await import(`file://${realPath}`); 
        if(typeof migrateFn !== "function")
            throw new Error(`Migration function is required but not provied by file \"${realPath}"!`);
            
        await migrateFn(connection);
    }
    
}