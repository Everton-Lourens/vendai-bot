import { validate, v4 as uuid } from 'uuid';
import { logger } from '../helpers/logger.js';
export const validateBody = (req) => {
    try {
        const { client } = req.body;
        var { id, stage, message } = client;
        id === '999' ? id = uuid() : id; // PENAS PARA TESTES, DEPOIS QUE COLOCAR UUID DOS CLIENTES NÃO SERÁ MAIS NECESASÁRIO
        req.body.client.id = id;
        if (!validate(id))
            return false;
        if (typeof message !== 'string')
            return false;
        if (typeof stage !== 'number')
            return false;
        return true;
    }
    catch (error) {
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
