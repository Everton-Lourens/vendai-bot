import { pool } from '../../connections/conn_postgres.js';
export async function count() {
    return pool.query(`SELECT COUNT(1) FROM pessoas`);
}
