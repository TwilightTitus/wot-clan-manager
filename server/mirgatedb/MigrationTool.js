import fileservice from "fs/promises";
import {DEFAULTDIR, DEFAULTTABLENAME} from "./Constants.js"

const FILENAME_SPLIT = /(V)(\d+\.\d+\.\d+)-([^\.]+)\.(js|sql)/i;
const STATEMENT__CHECKTABLE = `select * from ${DEFAULTTABLENAME} where ID = 0`;
const STATEMENT__CREATEMIGRATIONTABLE = 
`CREATE TABLE ${DEFAULTTABLENAME} (
    id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    file VARCHAR NOT NULL,
    version VARCHAR NOT NULL,
    executed timestamptz NOT NULL DEFAULT NOW()
)`;

const STATEMENT__IS_FILE_EXECUTED = `select * from ${DEFAULTTABLENAME} where file = $1`;

const toFileparts = (filename) => {
    const match = FILENAME_SPLIT.exec(filename);
    const [file, type, version, title, extention] = match;
    return {
        file, 
        type, 
        version, 
        title, 
        extention
    };
}



const initTable = async (connection) => {
    if(! await checkIfTableExists(checkIfTableExists))
        await createMigrationTable(connection);
}

const checkIfTableExists = async (connection) => {
    try{
        connection.execute(STATEMENT__CHECKTABLE);
        return true;
    }catch(e){
        return false;
    }
}

const createMigrationTable = async (connection) => {
    connection.execute(STATEMENT__CREATEMIGRATIONTABLE);
    connection.commit();
}


export default class MigrationTool {
    #databaseClient = null;

    constructor(databaseClient){
        this.#databaseClient = databaseClient;
    }

    async migrate(){
        const connection = await this.#databaseClient.connection();
        await initTable(connection);

        let files = await fileservice.readdir(DEFAULTDIR);
        files = files.map((file) => {
            if(file != "." && file != "..")
                return toFileparts(file);
        } );

        console.log(files)

    }
    
}