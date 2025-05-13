import { Request, Response, NextFunction } from 'express';
import _ from 'lodash';
import { validate, v4 as uuid } from 'uuid';
import { logger } from '../helpers/logger';

import dotenv from 'dotenv';
dotenv.config({ path: '.env.development' });

export const validateBody = async (req: Request): Promise<boolean> => {
    try {
        const { client } = req?.body;

        const requiredFields = ['id', 'stage', 'message', 'chatbot_id'];
        const missingFields = requiredFields.filter(field => !String(client[field]));

        if (missingFields.length > 0) return false;

        const { id } = client;
        if (process.env.NODE_ENV === 'development' && !!id) { // PENAS PARA TESTES
            return true;
        } else {
            if (!validate(id)) return false;
        }

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
            // Type 'Response<any, Record<string, any>>' is not assignable to type 'void'
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

