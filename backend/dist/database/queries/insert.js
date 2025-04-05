import { pool } from '../connection.js';
export async function insertChatbot(id, { store, name, created_at, messages }) {
    const query = `
    INSERT INTO
     chatbot(
        id,
        store,
        name,
        created_at,
        messages
     )
    VALUES (
        $1,
        $2,
        $3,
        $4,
        $5::json
    )
    `;
    return pool.query(query, [id, store, name, created_at, JSON.stringify(messages)]);
}
