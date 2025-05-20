import { Request, Response, NextFunction } from 'express';
import _ from 'lodash';
import { logger } from '../helpers/logger';

import dotenv from 'dotenv';
dotenv.config({ path: '.env.development' });

export const validateBody = (req: Request, _res: Response, next: NextFunction): void => {
    try {
        const { client } = req?.body;

        const requiredFields = ['message', 'stage', 'userId', 'clientId'];
        const missingFields = requiredFields.filter(field => !String(client[field]));

        if (missingFields.length > 0) {
            next(new Error('Dados inválidos no corpo da requisição.'));
            return;
        }
        const { userId, clientId, stage, message } = client;

        if (!userId && typeof userId !== 'string') {
            next(new Error('Dados inválidos no corpo da requisição.'));
            return;
        }

        if (!clientId && typeof clientId !== 'string') {
            next(new Error('Dados inválidos no corpo da requisição.'));
            return;
        }

        if (typeof stage !== 'number' || stage < 0) {
            next(new Error('Dados inválidos no corpo da requisição.'));
            return;
        }

        if (typeof message !== 'string' || message.trim() === '') {
            next(new Error('Dados inválidos no corpo da requisição.'));
            return;
        }

        next();
    } catch (error) {
        logger.error('Erro de validação');
        logger.error(error);
        next(error);
    }
};

export const validationFilter = (req: Request, res: Response, next: NextFunction): void => {
    try {
        validateBody(req, res, next);
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Erro interno no servidor. Tente novamente mais tarde.' });
    }
};

export const errorHandler = (err: any, req: Request, res: Response, _: NextFunction): void => {
    res.status(err.status || 500).end();
};

