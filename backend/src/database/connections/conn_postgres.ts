import pg from 'pg';
import { logger } from '../../helpers/logger.js';

const URL = process.env.DB_URL || 'postgres://postgres:12345678@localhost:5432/postgres';

export const pool = new pg.Pool({
    connectionString: URL,
    max: (Number(process.env.DB_POOL) || 200),
    idleTimeoutMillis: 0,
    connectionTimeoutMillis: 10000
});

pool.on('error', connect);

pool.once('connect', async () => {
    logger.info(`database.js: Connected  to db ${URL}`);
    await pool.query(`
        CREATE EXTENSION IF NOT EXISTS pg_trgm;

        CREATE TABLE IF NOT EXISTS chatbot (
            id uuid DEFAULT gen_random_uuid() UNIQUE NOT NULL,
            store TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            messages JSON
        );
        `)
});

async function connect() {
    try {
        logger.info(`Connecting to db ${URL}`);
        await pool.connect();
    } catch (err) {
        setTimeout(() => {
            connect();
            logger.error(`database.js: an error occured when connecting ${err} retrying connection on 3 secs`);
        }, 3000)
    }
}

connect();

const LOG_TRESHOLD = Number(process.env.LOG_TRESHOLD) || 3000;

if (process.env.SLOW_QUERY_ALERT === 'true') {
    Object.keys(module.exports).forEach((mK) => {
        const fn = module.exports[mK];

        module.exports[mK] = async function (...args: unknown[]) {
            const timestamp = Date.now();
            const result = await fn(...args);
            const final = Date.now();
            const delta = final - timestamp;
            if (delta >= LOG_TRESHOLD) {
                logger.warn(`Query took ${delta}ms for fn ${fn.name}`);
            }
            return result;
        }
    })
}

