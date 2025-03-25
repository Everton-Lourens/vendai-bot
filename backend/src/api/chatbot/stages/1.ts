import { storage } from '../storage.js';
import { getMessageDatabase, getAllItemsDatabase } from '../../../db_exemple/local_database.js';

export const stageOne = {
  async exec({ id, message }: { id: string, message: string }): Promise<{ nextStage: number; order: {}; response: string }> {

    const response: string = await (async () => {
      if (message === '1') {
        storage[id].stage = 2; // stage da escolha dos itens

        const allItems2 = getAllItemsDatabase('all_items');
        const itemsDescription = Object.values(allItems2)
          .map((item: any) => item?.description)
          .join('\n');
        return itemsDescription || 'Erro ao buscar itens do banco de dados';

      }
      else if (message === '2') {
        storage[id].stage = 1; // permanece nesse stage, apenas mostra a taxa de entrega
        return getMessageDatabase('delivery_tax')?.message_1 || 'Erro ao buscar mensagem do banco de dados';
      }
      else if (message === '3') {
        storage[id].wantsHumanService = true;
        storage[id].stage = 3; // vai para o stage do atendente
        return getMessageDatabase('attendant_stage')?.message_1 || 'Erro ao buscar mensagem do banco de dados';
      }
      else {
        return 'Digite uma opção válida, por favor. 🙋‍♀️';
      }
    })();

    // armazena o que o cliente falou e o que o bot respondeu para ter controle do que está acontecendo e como melhorar caso necessário
    storage[id].trackRecordResponse.push({
      id,
      currentStage: 1,
      nextStage: storage[id].stage,
      message,
      response
    });

    return {
      nextStage: storage[id].stage,
      order: storage[id],
      response
    };

  },
}