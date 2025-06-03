import { storage } from '../storage';
//import { getMessageStoredDatabase, getAllItemsDatabase } from '../../database/local_database';
import { getAllCachedItems } from '../cache/index';
import { ChatbotClient } from '../../entities/chatbot';
import { ChatbotMessages } from '../messages';

export const stageTwo = {
  async exec({ client }: { client: ChatbotClient }): Promise<{ respondedClient: ChatbotClient }> {
    const chatbotMessages = new ChatbotMessages({ client });

    if (client.message === '1') {
      storage[client.clientId].stage = 2;
      const responseMessage = await chatbotMessages.getResponse(2, 1);
      const listProductMessage = await chatbotMessages.getListProductMessage();
      chatbotMessages.setResponse(`${responseMessage}\n——————————\n${listProductMessage}`);
      console.log(`${responseMessage}\n——————————\n${listProductMessage}`);
      console.log(`@@@@@@@@@@@@@@@@@@`);
            console.log(await chatbotMessages.getResponse());
    } else {
      storage[client.clientId].stage = 3;
      storage[client.clientId].humanAttendant = true;
      const awaitAttendantMessage = await chatbotMessages.getResponse(3, 1);
      chatbotMessages.setResponse(awaitAttendantMessage);
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
