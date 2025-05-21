import { storage } from '../storage';
//import { getMessageStoredDatabase } from '../../database/local_database';
import { getOneCachedItem } from '../cache/index';
import { ResponseStage } from './0';
import { ChatbotClient } from '../../entities/chatbot';
import { ChatbotMessages } from '../messages';

export const stageTwo = {
  async exec({ client }: ChatbotClient): Promise<ResponseStage> {
    const chatbotMessages = new ChatbotMessages({ client });

    //allMessages = allMessages || await getMessageStoredDatabase('stage_0');
    const response: string = await (async () => {
      try {
        const getNewItem = await getOneCachedItem(client.userId, client.message);
        if (getNewItem === null)
          return 'Digite uma opção válida, por favor. 🙋‍♀️';

        const itemName = getNewItem?.name;
        const itemDescription = getNewItem?.description;
        const itemPrice = getNewItem?.price;

        storage[client.clientId].items.push(getNewItem); // adiciona o item ao carrinho;
        storage[client.clientId].stage = 3; // vai para o stage do atendente
        storage[client.clientId].humanAttendant = true; // vai para o stage do atendente

        return 'Ótima escolha!' + '\n' +
          '——————————\n' +
          `Item: ${itemName}\n` +
          `Descrição: ${itemDescription}\n` +
          `Preço: R$${itemPrice}\n` +
          '——————————\n\n'

        //getMessageStoredDatabase('attendant_stage')?.position_1;

      } catch (error) {

      }
    })();


    if (client.message === '1') {
      storage[client.clientId].stage = 2;
      const responseMessage = await chatbotMessages.getMessageStored({ stage: 1, position: 1 });
      const listProductMessage = await chatbotMessages.getListProductMessage({ limit: 1, offset: 1 });
      chatbotMessages.setResponse(`${responseMessage}\n\n${listProductMessage}`);
    } else {
      storage[client.clientId].stage = 3;
      storage[client.clientId].humanAttendant = true;
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