import { Request, Response, NextFunction } from 'express';
import _ from 'lodash';
import { validate } from 'uuid';
import { logger } from '../helpers/logger.js';

export const validateBody = (req: Request): boolean => {
    const { id, stage, message } = req.body;

    if (!validate(id)) return false;

    if (typeof message !== 'string') return false;

    if (typeof stage !== 'number') return false;

    return true;
};

export const validationFilter = (req: Request, res: Response, next: NextFunction): void => {
    try {
        if (!validateBody(req)) {
            console.log('Erro de validação');
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

