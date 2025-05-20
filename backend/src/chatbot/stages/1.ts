import { storage } from '../storage';
//import { getMessageDatabase, getAllItemsDatabase } from '../../database/local_database';
import { getAllCachedItems } from '../cache/index';
import { ChatbotClient } from '../../entities/chatbot';
import { ResponseStage } from './0';

export const stageOne = {
  async exec({ client }: ChatbotClient): Promise<ResponseStage> {

    //allMessages = allMessages || await getMessageDatabase('stage_0');
    const response: string = await (async () => {
      if (client.message === '1') {
        storage[client.clientId].stage = 2; // stage da escolha dos itens

        const allItems = await (async () => {
          try {
            return await getAllCachedItems(client.userId);
          } catch (error) {
            //return getAllItemsDatabase('all_items');
          }
        })();

        const itemsDescription: string = Object.values(allItems)
          .map((item: any, index: number) => `${numberEmoji(index)} → ${item?.description}, R$${item?.price},00`)
          .join('\n');
        return itemsDescription || 'Erro ao buscar itens do banco de dados';

      } else if (client.message === '2') {
        storage[client.clientId].stage = 1; // permanece nesse stage, apenas mostra a taxa de entrega
        //return getMessageDatabase('delivery_tax')?.position_1;
      } else if (client.message === '3') {
        storage[client.clientId].wantsHumanService = true;
        storage[client.clientId].stage = 3; // vai para o stage do atendente
        //return getMessageDatabase('attendant_stage')?.position_1;
      } else {
        return 'Digite uma opção válida, por favor. 🙋‍♀️';
      }
    })();

    const respondedClient = {
      ...client,
      stage: storage[client.clientId].stage,
      response,
      order: storage[client.clientId],
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