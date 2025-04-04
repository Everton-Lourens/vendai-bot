import { QueryResult } from 'pg';
import { pool } from '../connection.js';

export async function insertChatbot(
    id: string,
    { store, name, created_at, messages }: { store: string, name: string, created_at: Date, messages: string[] }
): Promise<QueryResult> {
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




