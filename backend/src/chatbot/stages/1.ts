import { storage } from '../storage';
//import { getMessageStoredDatabase, getAllItemsDatabase } from '../../database/local_database';
import { getAllCachedItems } from '../cache/index';
import { ChatbotClient } from '../../entities/chatbot';
import { ResponseStage } from './0';
import { ChatbotMessages } from '../messages';

export const stageOne = {
  async exec({ client }: ChatbotClient): Promise<ResponseStage> {
    const chatbotMessages = new ChatbotMessages({ client });

    if (client.message === '1') {
      storage[client.clientId].stage = 2;
      const responseMessage = await chatbotMessages.getResponse(1, 1);
      const listProductMessage = await chatbotMessages.getListProductMessage();
      chatbotMessages.setResponse(`${responseMessage}\n\n${listProductMessage}`);
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
