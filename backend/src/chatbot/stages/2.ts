import { storage } from '../storage';
//import { getMessageDatabase } from '../../database/local_database';
import { getOneCachedItem } from '../cache/index';
import { BodyResponseChatbot } from './0';
import { Message } from '../../entities/chatbot';

export const stageTwo = {
  async exec({ message, userId, clientId }: Message): Promise<BodyResponseChatbot> {

    //allMessages = allMessages || await getMessageDatabase('stage_0');
    const response: string = await (async () => {

      try {
        const getNewItem = await getOneCachedItem(userId, message);
        if (getNewItem === null)
          return 'Digite uma opção válclientIda, por favor. 🙋‍♀️';

        const itemName = getNewItem?.name;
        const itemDescription = getNewItem?.description;
        const itemPrice = getNewItem?.price;

        storage[clientId].items.push(getNewItem); // adiciona o item ao carrinho;
        storage[clientId].stage = 3; // vai para o stage do atendente
        storage[clientId].wantsHumanService = true; // vai para o stage do atendente

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

    return {
      nextStage: storage[clientId].stage,
      response,
      order: storage[clientId]
    };

  },
}