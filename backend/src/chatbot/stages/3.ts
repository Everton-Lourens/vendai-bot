import { storage } from '../storage';
//import { getResponseDatabase } from '../../database/local_database';
import { getOneCachedItem } from '../cache/index';
import { ChatbotClient } from '../../entities/chatbot';
import { ChatbotMessages } from '../messages';

export const stageThree = {
  async exec({ client }: { client: ChatbotClient }): Promise<{ respondedClient: ChatbotClient }> {
    const chatbotMessages = new ChatbotMessages({ client });

    const index = parseInt(client.message, 10);
    if (isNaN(index) || index < 0) {
      chatbotMessages.setResponse('Digite uma opção válida, por favor. 🙋‍♀️');
    } else {
      storage[client.clientId].stage = 3;
      storage[client.clientId].humanAttendant = true;
      const newItem = await chatbotMessages.getProductByCode(client.message);
      storage[client.clientId].order.items.push(newItem._id);
      chatbotMessages.setResponse(
        'Ótima escolha!' +
        '\n' +
        '——————————\n' +
        `Item: ${newItem.name}\n` +
        `Preço: R$${newItem.value},00\n` +
        '——————————\n\n'
      );
    }

    const response = await chatbotMessages.getResponse();
    const respondedClient = {
      ...client,
      stage: storage[client.clientId].stage,
      order: storage[client.clientId].order,
      response,
    }
    return { respondedClient };
  },
}