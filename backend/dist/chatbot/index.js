import { logger } from '../helpers/logger.js';
import { formatApiResponse } from '../helpers/bodyResponse.js';
import { stages, getStage } from './stages.js';
import { getAllCachedMessages } from './cache/index.js';
export const chatbot = async (data) => {
    try {
        const { id, chatbot_id, stage, message } = data?.client || data;
        // Armazeno as mensagens do chatbot dentro do respose do cliente para evitar
        // armazenar em memória, cache ou acessar o banco de dados muitas vezes
        var allMessages = data?.client?.allMessages || data?.allMessages || [];
        if (allMessages?.length === 0)
            allMessages = await getAllCachedMessages(chatbot_id);
        const currentStage = await getStage({ id, stage });
        const { nextStage, response, order } = await stages[currentStage].stage.exec({
            id,
            message,
            chatbot_id
        });
        const successResponse = formatApiResponse({
            status: 200,
            message: 'Operação realizada com sucesso',
            client: {
                id,
                chatbot_id,
                stage: nextStage,
                message,
                response,
                order,
                allMessages
            }
        });
        return successResponse;
    }
    catch (error) {
        logger.error('Erro desconhecido ao executar o chatbot');
        logger.error(error);
        const errorResponse = formatApiResponse({
            status: 500,
            message: 'Erro desconhecido ao executar o chatbot: ' + error,
            errorCode: 'CHATBOT_UNKNOWN_ERROR'
        });
        return errorResponse;
    }
};
