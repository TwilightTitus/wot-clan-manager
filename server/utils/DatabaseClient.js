import pg from "pg/lib/index.js";
import DatabaseClient from "../database/DatabaseClient.js";
import Connection from "../database/Connection.js";

const ERROR__CONNECTION_CLOSED = "Connection is closed!";

class PostgreConnection extends Connection {
	#closed = false;
	#closedCallback;
	#connection;
	#hasTransaction;

	constructor(connection, closedCallback) {
		super();
		this.#connection = connection;
		this.#closedCallback = closedCallback;
	}

	async #transaction() {
		if (!this.#hasTransaction) this.#hasTransaction = (await this.#connection).query("BEGIN");

		return this.#hasTransaction;
	}

	async query(query, params) {
		try {
			if (this.#closed) throw new Error(ERROR__CONNECTION_CLOSED);
			await this.#transaction();
			const connection = await this.#connection;
			return await connection.query({
				text: query,
				values: params,
			});
		} catch (e) {
			throw new Error(e.message);
		}
	}

	async commit() {
		if (this.#closed) throw new Error(ERROR__CONNECTION_CLOSED);

		if (this.#hasTransaction) {
			await (await this.#connection).query("COMMIT");
			this.#hasTransaction = null;
		}
	}

	async rollback() {
		if (this.#hasTransaction) {
			await (await this.#connection).query("ROLLBACK");
			this.#hasTransaction = null;
		}
	}

	async close() {
		if (this.#closed) return;

		await this.rollback();
		await (await this.#connection).release();
		this.#closed = true;
		this.#closedCallback();
	}
}

class PostgreDatabaseClient extends DatabaseClient {
	#pool = null;
	#openConnections = new Set();
	constructor() {
		super();
		try {
			this.#pool = new pg.Pool({
				connectionString: process.env.DATABASE_URL,
				connectionTimeoutMillis: 10000,
				idleTimeoutMillis: 10000,
				max: 10,
				allowExitOnIdle: true,
			});
		} catch (e) {
			console.error(e);
		}
	}

	async connection() {
		const connection = new PostgreConnection(this.#pool.connect(), () => {
			this.#openConnections.delete(connection);
		});

		this.#openConnections.add(connection);

		return connection;
	}

	async close() {
		const promises = [];
		for (let connection of this.#openConnections) {
			promises.push(connection.close());
		}

		await Promise.all(promises);
	}
}

const INSTANCE = new PostgreDatabaseClient();

export default INSTANCE;
