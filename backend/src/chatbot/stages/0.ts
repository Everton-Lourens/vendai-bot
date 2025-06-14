import { container } from 'tsyringe';
import { storage } from '../storage';
import { ListMessageService } from '../../useCases/Message/ListMessages/ListMessageService.service';
import { ChatbotClient } from '../../entities/chatbot';
import { ChatbotMessages } from '../messages';

export const initialStage = {
  async exec({ client }: { client: ChatbotClient }): Promise<{ respondedClient: ChatbotClient }> {
    const chatbotMessages = new ChatbotMessages({ client });
    const response = await chatbotMessages.getResponse(1, 1) +
      '\n——————————\n' +
      '1️⃣ –> FAZER PEDIDO\n' +
      '2️⃣ → TAXA de Entrega\n' +
      '3️⃣ → FALAR C/ Atendente';

    storage[client.clientId].stage = 1;

    const respondedClient = {
      ...client,
      stage: storage[client.clientId].stage,
      order: storage[client.clientId].order,
      response,
    }
    return { respondedClient };
  },
}