import pg from "pg/lib/index.js";

const pool = (() => {
	try {
		return new pg.Pool({
			connectionString: process.env.DATABASE_URL,
			connectionTimeoutMillis: 10000,
			idleTimeoutMillis: 10000,
			max: 10,
			allowExitOnIdle: true,
		});
	} catch (e) {
		console.error(e);
		return null;
	}
})();

export default pool;
