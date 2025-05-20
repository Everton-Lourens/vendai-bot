import { storage } from '../storage';
//import { getMessageDatabase } from '../../database/local_database';
import { getOneCachedItem } from '../cache/index';
import { ResponseStage } from './0';
import { ChatbotClient } from '../../entities/chatbot';

export const stageTwo = {
  async exec({ client }: ChatbotClient): Promise<ResponseStage> {

    //allMessages = allMessages || await getMessageDatabase('stage_0');
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
        storage[client.clientId].wantsHumanService = true; // vai para o stage do atendente

        return 'Ótima escolha!' + '\n' +
          '——————————\n' +
          `Item: ${itemName}\n` +
          `Descrição: ${itemDescription}\n` +
          `Preço: R$${itemPrice}\n` +
          '——————————\n\n'

        //getMessageDatabase('attendant_stage')?.position_1;

      } catch (error) {

      }
    })();

    const respondedClient = {
      ...client,
      stage: storage[client.clientId].stage,
      order: storage[client.clientId].order,
      response,
    }
    return { respondedClient };
  },
}