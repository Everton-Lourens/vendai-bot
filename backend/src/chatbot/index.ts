import { logger } from '../helpers/logger.js';
import { formatApiResponse } from '../helpers/bodyResponse.js';
import { getAllMessages } from '../database/queries/select.js';
import { stages, getStage } from './stages.js';

interface Client {
   id: string;
   chatbot_id: string;
   stage: number;
   message: string;
   allMessages: object | undefined;
   [key: string]: any; // Optional: To allow additional properties
}

export const chatbot = async (data: {
   client: Client;
   allMessages?: object | undefined; // Add allMessages to the data type
}): Promise<{
   status: number;
   message: string;
   timestamp: string;
   client: {
      id: string;
      message: string;
      response: string;
      order: object | undefined;
      allMessages: object | undefined;
   };
}> => {
   try {
      const { id, chatbot_id, stage, message } = data?.client || data;
      var allMessages = data?.client?.allMessages || data?.allMessages || undefined;

      if (!allMessages)
         allMessages = await getAllMessages(chatbot_id);

      const currentStage = await getStage({ id, stage });
      const { nextStage, response, order } = await stages[currentStage].stage.exec({
         id,
         message
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

   } catch (error) {
      logger.error('Erro desconhecido ao executar o chatbot');
      logger.error(error);
      const errorResponse = formatApiResponse({
         status: 500,
         message: 'Erro desconhecido ao executar o chatbot: ' + error,
         errorCode: 'CHATBOT_UNKNOWN_ERROR'
      });
      return errorResponse;
   }
}



