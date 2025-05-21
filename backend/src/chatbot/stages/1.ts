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
      const responseMessage = await chatbotMessages.getMessageStored({ stage: 1, position: 1 });
      const listProductMessage = await chatbotMessages.getListProductMessage({ limit: 1, offset: 1 });
      chatbotMessages.setResponse(`${responseMessage}\n\n${listProductMessage}`);
    } else {
      storage[client.clientId].stage = 3;
      storage[client.clientId].wantsHumanService = true;
      const awaitAttendantMessage = await chatbotMessages.getMessageStored({ stage: 3, position: 1 });
      chatbotMessages.setResponse(awaitAttendantMessage);
    }
    const response = chatbotMessages.getResponse();
    const respondedClient = {
      ...client,
      stage: storage[client.clientId].stage,
      order: storage[client.clientId].order,
      response,
    }
    return { respondedClient };
  },
}


function numberEmoji(number: number) {
  const blueEmojis = [
    "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"
  ];

  if (number < 0 || number > 9) {
    return number;
  }

  return blueEmojis[number];
}