import { QueryResult } from 'pg';
import { pool } from '../connection.js';

export async function findById(id: string): Promise<QueryResult> {
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
    `
    return pool.query(query, [id]);
}


export async function getAllMessages(chatbotId: string): Promise<{ stage: number; message_number: number; content: string }[]> {
    const query = `
    SELECT
        message.stage,
        message.message_number,
        message.content
    FROM
        chatbot_message AS message
    JOIN
        chatbot AS bot ON message.chatbot_id = $1;
    `;
    const querySet = await pool.query(query, [chatbotId]);
    return querySet.rows;
}


export async function getIdChatbotToDevelopment(): Promise<{ id: string }> {

    const query1 = `
    SELECT id FROM chatbot WHERE store = 'loja_exemplo';
    `;
    const querySet1 = await pool.query(query1);
    if (querySet1.rows.length > 0) {
        const [{ id }] = querySet1.rows;
        return { id };
    }

    const query2 = `
    INSERT INTO chatbot (store, name)
    VALUES ('loja_exemplo', 'nome_exemplo')
    ON CONFLICT (store) DO NOTHING
    RETURNING id;
    `;
    const querySet2 = await pool.query(query2);
    const [{ id }] = querySet2.rows;
    return { id };
}



export async function existsByStore(store: string): Promise<{ count: number }> {
    const querySet = await pool.query(`SELECT COUNT(1) FROM chatbot WHERE "store" = $1`, [store])
    const [result] = querySet.rows;
    return result;
}
