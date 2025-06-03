import { ChatbotClient } from '../../entities/chatbot';
import { storage } from '../storage';

export const stageFour = {
  async exec({ client }: { client: ChatbotClient }): Promise<{ respondedClient: ChatbotClient }> {
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