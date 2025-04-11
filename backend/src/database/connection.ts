import pg from 'pg';
import { logger } from '../helpers/logger.js';

//const URL = process.env.DB_URL || 'postgres://postgres:12345678@localhost:5432/postgres';
const URL = process.env.DB_URL || 'postgres://postgres:12345678@localhost:5432/chat';

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

                        -- Chatbot
                        CREATE TABLE IF NOT EXISTS chatbot (
                            id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
                            store TEXT UNIQUE NOT NULL, -- nome da loja
                            name TEXT NOT NULL,         -- nome do chatbot
                            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                        );

                        -- Mensagens por estágio do chatbot
                        CREATE TABLE IF NOT EXISTS chatbot_message (
                            id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
                            chatbot_id uuid NOT NULL,
                            stage INT NOT NULL,              -- etapa que a mensagem pertence
                            message_number INT NOT NULL,     -- número da mensagem dentro da etapa
                            content TEXT NOT NULL,           -- conteúdo da mensagem
                            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                            FOREIGN KEY (chatbot_id) REFERENCES chatbot(id) ON DELETE CASCADE
                        );

                        -- Cliente atendido
                        CREATE TABLE IF NOT EXISTS customer (
                            id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
                            chatbot_id uuid NOT NULL,
                            name TEXT NOT NULL,
                            email TEXT UNIQUE,
                            address TEXT,
                            phone TEXT CHECK (phone ~ '^\([0-9]{2}\)[0-9]{9}$'), -- formato (00)000000000
                            status TEXT NOT NULL CHECK (status IN ('open', 'in_progress', 'closed')) DEFAULT 'open',
                            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                            FOREIGN KEY (chatbot_id) REFERENCES chatbot(id) ON DELETE CASCADE
                        );

                        -- Produto/Item disponível para compra
                        CREATE TABLE IF NOT EXISTS item (
                            id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
                            chatbot_id uuid NOT NULL,
                            name TEXT NOT NULL,
                            description TEXT,
                            price DECIMAL(10,2) NOT NULL,
                            FOREIGN KEY (chatbot_id) REFERENCES chatbot(id) ON DELETE CASCADE
                        );

                        -- Tabela intermediária entre cliente e item
                        CREATE TABLE IF NOT EXISTS customer_item (
                            customer_id uuid NOT NULL,
                            item_id uuid NOT NULL,
                            quantity INT NOT NULL DEFAULT 1, -- quantidade do item
                            PRIMARY KEY (customer_id, item_id),
                            FOREIGN KEY (customer_id) REFERENCES customer(id) ON DELETE CASCADE,
                            FOREIGN KEY (item_id) REFERENCES item(id) ON DELETE CASCADE
                        );

                        -- Agente de suporte
                        CREATE TABLE IF NOT EXISTS support_agent (
                            id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
                            name TEXT NOT NULL,
                            email TEXT UNIQUE NOT NULL,
                            phone TEXT CHECK (phone ~ '^\([0-9]{2}\)[0-9]{9}$') -- formato (00)000000000
                        );

                        -- Ticket de suporte (atendimento)
                        CREATE TABLE IF NOT EXISTS support_ticket (
                            id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
                            customer_id uuid NOT NULL,
                            agent_id uuid, -- pode ser nulo
                            subject TEXT NOT NULL, -- assunto do ticket
                            status TEXT NOT NULL CHECK (status IN ('open', 'in_progress', 'closed')) DEFAULT 'open',
                            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                            FOREIGN KEY (customer_id) REFERENCES customer(id) ON DELETE CASCADE,
                            FOREIGN KEY (agent_id) REFERENCES support_agent(id) ON DELETE SET NULL
                        );

                        -- Mensagens dentro de um ticket
                        CREATE TABLE IF NOT EXISTS support_message (
                            id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
                            ticket_id uuid NOT NULL,
                            sender TEXT NOT NULL CHECK (sender IN ('customer', 'agent', 'system')),
                            content TEXT NOT NULL,
                            sent_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                            FOREIGN KEY (ticket_id) REFERENCES support_ticket(id) ON DELETE CASCADE
                        );
                    `);

    await pool.query(`
                        WITH inserted_chatbot AS (
                            INSERT INTO chatbot (store, name) VALUES
                            ('loja_exemplo', 'MeganBot')
                            RETURNING id
                        ),
                        inserted_items AS (
                            INSERT INTO item (chatbot_id, name, description, price)
                            SELECT id, 'Item 1', 'Primeiro item', '10.00'
                            FROM inserted_chatbot
                            RETURNING id
                        )
                        INSERT INTO chatbot_message (chatbot_id, stage, message_number, content)
                        VALUES (
                            (SELECT id FROM inserted_chatbot),
                            1,
                            1,
                            'Bem-vindo, sou a MeganBot!'
                        );
                    `);
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

