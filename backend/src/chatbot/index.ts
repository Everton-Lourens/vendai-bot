import { logger } from '../helpers/logger';
import { formatApiResponse } from '../helpers/bodyResponse';
import { stages, getStage } from './stages';
import { Client } from '../entities/chatbot';


interface BodyResponse {
   status: number;
   message: string;
   timestamp: string;
   client: Client;
}

export const chatbot = async (bodyClient: Client): Promise<BodyResponse> => {
   try {
      const { userId, clientId, stage, message } = bodyClient;

      const currentStage = await getStage({ clientId, stage });
      const { nextStage, response, order } = await stages[currentStage].stage.exec(bodyClient);

      const successResponse = formatApiResponse({
         status: 200,
         message: 'Operação realizada com sucesso',
         client: {
            userId,
            clientId,
            stage: nextStage,
            message,
            response,
            order
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



