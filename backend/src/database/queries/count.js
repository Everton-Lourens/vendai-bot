import { pool } from '../connection.js';
export async function count() {
    return pool.query(`SELECT COUNT(1) FROM chatbot`);
}
