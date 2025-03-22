import { storage } from '../storage.js';
import { getMessageDatabase } from '../../../db_exemple/local_database.js';
import { logger } from '../../../helpers/logger.js';

export const initialStage = {
  async exec({ id, message }: { id: string, message: string }): Promise<{ nextStage: number; order: {}; response: string }> {
    storage[id].stage = 1;

    // Recebe uma lista do nome das lojas
    const response = getMessageDatabase('stage_0')?.message_1 || 'Erro ao buscar mensagem do banco de dados';

    // armazena o que o cliente falou e o que o bot respondeu para ter controle do que está acontecendo e como melhorar caso necessário
    storage[id].trackRecordResponse.push({
      id,
      currentStage: 0,
      nextStage: storage[id].stage,
      message,
      response
    });

    return {
      nextStage: storage[id].stage,
      order: storage[id],
      response
    };

    /*
    async function wellcome() {
      storage[id].obj_store = {}; // zera caso o cliente deseje pedir outro atendente

      // Recebe uma lista do nome das lojas
      const listAllStore = await listOfStore({ from: id, numberChatbot: self });
      // Caso tenha apenas 1 retorna apenas 1 objeto e não uma Array List
      const itsJustOneStore = typeof listAllStore === 'object' && !Array.isArray(listAllStore.obj_store);
      // É um objeto e não é um array (Só tem 1 Loja)
      if (itsJustOneStore) {
        return await oneStore();
      } else {
        return await manyStore();
      }

      async function oneStore() {
        const lackOfPayment = await daysDifference(listAllStore.due_date);
        // confere se pagou o bot se se não pagou desativa...
        if (lackOfPayment || !listAllStore.chatbot_number) {
          logger.error('CHATBOT DESATIVADO!' + ' - NUMERO DO CHATBOT::::: ' + self);
          return 'CHATBOT DESATIVADO!';
        }
        // pega o único objeto store que foi cadastrada e coloca no storage do cliente
        storage[id].obj_store = listAllStore;
        // Como só tem uma Loja. retorna a mensagem do stage 1
        const { message_1 } = msgStage[1];
        // msg de bem-vindo + msg do stage 1 (fazer pedido) direto já que só tem 1 loja
        return `Olá, *${client_name ?? 'tudo bem?'}*\n` + message_1;
      }

      async function manyStore() {
        const lackOfPayment = await daysDifference(listAllStore.obj_store[0].due_date);
        // confere se pagou o bot se se não pagou desativa...
        if (lackOfPayment || !listAllStore.obj_store[0].chatbot_number) {
          logger.error('CHATBOT DESATIVADO!' + ' - NUMERO DO CHATBOT::::: ' + self);
          return 'CHATBOT DESATIVADO!';
        }
        const listNameStore = listAllStore?.listNameStore;
        const obj_store = listAllStore?.obj_store;
        // Armazena todas as Lojas no storage do cliente
        storage[id].obj_store = obj_store; ///////////// aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
        // se tiver mais que 1 loja, retorna true e mostra Array List com os nomes das lojas
        const { message_1 } = msgStage[0];
        message_1 + '\n' + // Mensagem padrão
          listNameStore; // nome das lojas e as opções para escolher uma loja
        if (!listNameStore || !listNameStore?.length)
          storage[id].attendant = true;
        // Retorna as opções de loja que ele deseja ser atendido
        return message_1 + '\n' + listNameStore;
      }
    }
    */

  },
}