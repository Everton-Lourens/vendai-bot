import { ChatbotClient } from '../../entities/chatbot';
import { storage } from '../storage';
import { ResponseStage } from './0';

export const stageThree = {
  async exec({ client }: ChatbotClient): Promise<ResponseStage> {
    var response = '';
    if (storage[client.clientId].humanAttendant === true)
      response = 'Você será encaminhado para um atendente. Aguarde...';

    const respondedClient = {
      ...client,
      stage: storage[client.clientId].stage,
      order: storage[client.clientId].order,
      response,
    }
    return { respondedClient };
  },
}