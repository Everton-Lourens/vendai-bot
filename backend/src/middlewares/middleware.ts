import { Request, Response, NextFunction } from 'express';
import _ from 'lodash';
import { validate, v4 as uuid } from 'uuid';
import { logger } from '../helpers/logger';

import dotenv from 'dotenv';
dotenv.config({ path: '.env.development' });

export const validateBody = async (req: Request): Promise<boolean> => {
    try {
        const { client } = req?.body;

        const requiredFields = ['message', 'stage', 'userId', 'clientId'];
        const missingFields = requiredFields.filter(field => !String(client[field]));

        if (missingFields.length > 0) return false;
        const { userId, clientId, stage, message } = client;

        if (!userId && typeof userId !== 'string')
            return false;

        if (!clientId && typeof clientId !== 'string')
            return false;

        if (typeof stage !== 'number' || stage < 0)
            return false;

        if (typeof message !== 'string' || message.trim() === '')
            return false;

        return true;
    } catch (error) {
        logger.error('Erro de validação');
        logger.error(error);
        return false;
    }
};

export const validationFilter = (req: Request, res: Response, next: NextFunction): void => {
    try {
        if (!validateBody(req)) {
            logger.error('Erro de validação');
            res.status(422).json({ message: 'Dados inválidos no corpo da requisição.' });
            return;
        }
        next();
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Erro interno no servidor. Tente novamente mais tarde.' });
    }
};

export const errorHandler = (err: any, req: Request, res: Response, _: NextFunction): void => {
    res.status(err.status || 500).end();
};

