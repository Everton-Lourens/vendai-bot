import { storage } from '../storage';
//import { getMessageDatabase, getAllItemsDatabase } from '../../database/local_database';
import { getAllCachedItems } from '../cache/index';
import { Message } from '../../entities/chatbot';
import { BodyResponseChatbot } from './0';

export const stageOne = {
  async exec({ message, userId, clientId }: Message): Promise<BodyResponseChatbot> {

    //allMessages = allMessages || await getMessageDatabase('stage_0');
    const response: string = await (async () => {
      if (message === '1') {
        storage[clientId].stage = 2; // stage da escolha dos itens

        const allItems = await (async () => {
          try {
            return await getAllCachedItems(userId);
          } catch (error) {
            //return getAllItemsDatabase('all_items');
          }
        })();

        const itemsDescription: string = Object.values(allItems)
          .map((item: any, index: number) => `${numberEmoji(index)} → ${item?.description}, R$${item?.price},00`)
          .join('\n');
        return itemsDescription || 'Erro ao buscar itens do banco de dados';

      } else if (message === '2') {
        storage[clientId].stage = 1; // permanece nesse stage, apenas mostra a taxa de entrega
        //return getMessageDatabase('delivery_tax')?.position_1;
      } else if (message === '3') {
        storage[clientId].wantsHumanService = true;
        storage[clientId].stage = 3; // vai para o stage do atendente
        //return getMessageDatabase('attendant_stage')?.position_1;
      } else {
        return 'Digite uma opção válida, por favor. 🙋‍♀️';
      }
    })();

    return {
      nextStage: storage[clientId].stage,
      response,
      order: storage[clientId]
    };

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