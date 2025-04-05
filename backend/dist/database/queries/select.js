import { pool } from '../connection.js';
export async function findById(id) {
    const query = `
    SELECT
        id,
        store,
        name,
        to_char(created_at, 'YYYY-MM-DD') as created_at,
        messages
    FROM
        chatbot
    WHERE "id" = $1;
    `;
    return pool.query(query, [id]);
}
export async function existsByStore(store) {
    const querySet = await pool.query(`SELECT COUNT(1) FROM chatbot WHERE "store" = $1`, [store]);
    const [result] = querySet.rows;
    return result;
}
