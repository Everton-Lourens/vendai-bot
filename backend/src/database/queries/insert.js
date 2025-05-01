import { pool } from '../connection.js';
import { validate } from 'uuid';
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
export async function insertCustomerItem(customer_id, item_id, quantity = 1) {
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
