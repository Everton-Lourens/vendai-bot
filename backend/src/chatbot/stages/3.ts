import { ChatbotClient } from '../../entities/chatbot';
import { ChatbotMessages } from '../messages';
import { storage } from '../storage';

export const stageThree = {
  async exec({ client }: { client: ChatbotClient }): Promise<{ respondedClient: ChatbotClient }> {
    const chatbotMessages = new ChatbotMessages({ client });
    const item = storage[client.clientId].order.items[0];
    const response = await chatbotMessages.getResponse(3, 1) +
      (item ?
        '\n——————————\n' +
        `Item: ${item.name}\n` +
        `Preço: R$${item.value},00\n` +
        '——————————' : '');
    const respondedClient = {
      ...client,
      stage: storage[client.clientId].stage,
      order: storage[client.clientId].order,
      response,
    }
    return { respondedClient };
  },
}