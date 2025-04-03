import { QueryResult } from 'pg';
import { pool } from '../connection.js';

export async function insertChatbot(
    id: string,
    { store, name, created, messages }: { store: string, name: string, created: Date, messages: string[] }
): Promise<QueryResult> {
    const query = `
    INSERT INTO
     chatbot(
        id,
        store,
        name,
        created,
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
    return pool.query(query, [id, store, name, created, JSON.stringify(messages)]);
}




