import pg from 'pg';
import { logger } from '../helpers/logger.js';

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
                id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
                store TEXT UNIQUE NOT NULL, -- nome da loja
                name TEXT NOT NULL, -- nome do chatbot
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS chatbot_message (
                id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
                chatbot_id uuid NOT NULL,
                stage INT NOT NULL, -- etapa que a mensagem pertence
                message_number INT NOT NULL, -- numero da mensagem
                content TEXT NOT NULL, -- conteúdo da mensagem
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS customer (
                id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
                chatbot_id uuid NOT NULL,
                name TEXT NOT NULL,
                email TEXT UNIQUE,
                address TEXT,
                phone TEXT CHECK (phone ~ '^\([0-9]{2}\)[0-9]{9}$'), -- telefone do cliente no formato (00)000000000
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS item (
                id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
                name TEXT NOT NULL,
                description TEXT,
                price DECIMAL(10,2) NOT NULL
            );

            CREATE TABLE IF NOT EXISTS customer_item (
                customer_id uuid NOT NULL,
                item_id uuid NOT NULL,
                quantity INT NOT NULL DEFAULT 1, -- quantidade do item
                PRIMARY KEY (customer_id, item_id) -- chave composta
            );

            CREATE TABLE IF NOT EXISTS support_agent (
                id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL
                phone TEXT CHECK (phone ~ '^\([0-9]{2}\)[0-9]{9}$'),
            );

            CREATE TABLE IF NOT EXISTS support_message (
                id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
                ticket_id uuid NOT NULL,
                sender TEXT NOT NULL CHECK (sender IN ('customer', 'agent', 'system')), -- quem enviou a mensagem
                content TEXT NOT NULL, -- conteudo da mensagem
                sent_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP -- data de envio da mensagem
            );

            CREATE TABLE IF NOT EXISTS support_ticket (
                id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
                customer_id uuid NOT NULL,
                agent_id uuid, -- chave estrangeira para support_agent, pode ser nula
                subject TEXT NOT NULL, -- assunto do ticket
                status TEXT NOT NULL CHECK (status IN ('open', 'in_progress', 'closed')) DEFAULT 'open', -- status do ticket
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
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

