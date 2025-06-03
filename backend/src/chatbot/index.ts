import { logger } from '../helpers/logger';
import { BodyResponse, formatApiResponse } from '../helpers/bodyResponse';
import { stages, getStage } from './stages';
import { ChatbotClient } from '../entities/chatbot';

export const chatbot = async ({ client }: { client: ChatbotClient }): Promise<BodyResponse> => {
   try {
      const currentStage = await getStage({ client });
      const { respondedClient } = await stages[currentStage].stage.exec({ client });

      const successResponse = formatApiResponse({
         status: 200,
         messageCode: 'Operação realizada com sucesso',
         respondedClient,
      });
      return successResponse;
   } catch (error) {
      logger.error('Erro desconhecido ao executar o chatbot');
      logger.error(error);
      const errorResponse = formatApiResponse({
         status: 500,
         messageCode: 'Erro desconhecido ao executar o chatbot: ' + error,
      });
      return errorResponse;
   }
}



