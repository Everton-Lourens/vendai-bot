import express, { Router } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cluster from 'cluster';
import process from 'process';
import './database/connection.js';
import { errorHandler, validationFilter } from './middleware/middleware.js';
import { chatbot } from './chatbot/index.js';
import { logger } from './helpers/logger.js';
import { readDatabase_exemple } from './database/local_database.js';
import dotenv from 'dotenv';
import { getIdChatbotToDevelopment } from './database/queries/select.js';

dotenv.config({ path: '.env.development' });

const lastJsonBody: any = [];
const TIMEOUT = Number(process.env.REQ_TIMEOUT) || 5000;
const PORT = process.env.NODE_ENV === 'production' ? (Number(process.env.PORT) || 8080) : 9999;

const app = express();
const apiRouter = Router();

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

app.use(bodyParser.json());
app.use('/v1/chat', apiRouter);

apiRouter.post('/', validationFilter, async (req, res) => {
    try {
        if (process.env.NODE_ENV === 'development' && !req?.body?.client?.chatbot_id) { // PEGA O ID DO CHATBOT PENAS PARA TESTES
            const chatbot_id = await getIdChatbotToDevelopment();
            req.body.client.chatbot_id = chatbot_id?.id;
        }

        chatbot(req?.body).then((response) => {
            if (process.env.NODE_ENV === 'development') {
                lastJsonBody.unshift(response);
            }
            res.status(201).json({
                data: response
            }).end();
        }).catch(() => {
            res.status(422).end();
        });
    } catch (error) {
        logger.error('Erro ao enviar resposta do Chatbot:');
        logger.error(error);
        res.status(422).json({
            messageAlert: 'Erro ao enviar resposta do Chatbot',
            data: error
        }).end();
    }
});


/////////////////////////
// Rota de teste
if (process.env.NODE_ENV === 'development') {
    app.get('/', (req, res) => {
        try {
            var messageAlert = '';
            if (lastJsonBody.length === 0) {
                lastJsonBody.push(readDatabase_exemple() || {});
                messageAlert = 'Operação realizada com sucesso: Exemplo resposta do Chatbot para o cliente';
            } else {
                messageAlert = 'Operação realizada com sucesso: Histórico de respostas do Chatbot para você';
            }
            res.status(201).json({
                messageAlert,
                data: lastJsonBody
            }).end();
        } catch (error) {
            console.error('Erro ao enviar ultimo json response:', error);
            res.status(422).end();
        }
    });
}


app.use(errorHandler);

const numForks = Number(process.env.CLUSTER_WORKERS) || 1;

if (cluster.isPrimary && process.env.CLUSTER === 'true') {
    logger.info(`index.js: Primary ${process.pid} is running`);

    for (let i = 0; i < numForks; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        logger.info(`index.js: worker ${worker.process.pid} died: code ${code} signal ${signal}`);
    });
} else {
    const serverApp = app.listen(PORT, () => {
        logger.info(`index.js:${process.pid}:Listening on ${PORT}`);
    });

    if (process.env.USE_TIMEOUT === 'true') {
        serverApp.setTimeout(TIMEOUT);
        logger.info(`Starting with timeout as ${TIMEOUT}ms`);

        serverApp.on('timeout', (socket) => {
            logger.warn(`Timing out connection`);
            socket.end();
        });
    }
}

