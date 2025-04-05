import { validate } from 'uuid';
import { logger } from '../helpers/logger.js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.development' });
export const validateBody = (req) => {
    try {
        const { client } = req?.body;
        const requiredFields = ['id', 'stage', 'message'];
        const missingFields = requiredFields.filter(field => !String(client[field]));
        logger.info(missingFields.length);
        const missingFields2 = requiredFields.filter(field => !client[field]);
        logger.info(missingFields2.length);
        if (missingFields.length > 0)
            return false;
        const { id } = client;
        if (process.env.NODE_ENV === 'development' && !!id) {
            return true; // PENAS PARA TESTES, DEPOIS QUE COLOCAR UUID DOS CLIENTES NÃO SERÁ MAIS NECESASÁRIO
        }
        else {
            if (!validate(id))
                return false;
        }
        return true;
    }
    catch (error) {
        logger.error('Erro de validação');
        logger.error(error);
        return false;
    }
};
export const validationFilter = (req, res, next) => {
    try {
        if (!validateBody(req)) {
            logger.error('Erro de validação');
            // Type 'Response<any, Record<string, any>>' is not assignable to type 'void'
            res.status(422).json({ message: 'Dados inválidos no corpo da requisição.' });
            return;
        }
        next();
    }
    catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Erro interno no servidor. Tente novamente mais tarde.' });
    }
};
export const errorHandler = (err, req, res, _) => {
    res.status(err.status || 500).end();
};
