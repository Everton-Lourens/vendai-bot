import { QueryResult } from 'pg';
import { pool } from '../connection';
import { validate } from 'uuid';

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


export async function insertCustomerItem(
    customer_id: string,
    item_id: string,
    quantity: number = 1
): Promise<QueryResult> {
    if (validate(customer_id) || validate(item_id))
        throw new Error('UUID não é válido');
    if (quantity <= 0)
        throw new Error('Quantidade deve ser maior que 0 (ZERO)');

    const query = `
        INSERT INTO
        customer_item(
            customer_id,
            item_id,
            quantity
        )
        VALUES (
            $1,
            $2,
            $3
        )
        ON CONFLICT (customer_id, item_id) DO UPDATE
        SET quantity = customer_item.quantity + EXCLUDED.quantity
    `;
    return pool.query(query, [customer_id, item_id, quantity]);
}




