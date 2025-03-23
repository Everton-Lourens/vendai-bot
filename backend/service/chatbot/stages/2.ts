import { storage } from '../storage.js';
import { getMessageDatabase, getAllItemsDatabase } from '../../../db_exemple/local_database.js';

export const stageTwo = {
  async exec({ id, message }: { id: string, message: string }): Promise<{ nextStage: number; order: {}; response: string }> {

    const response: string = await (async () => {

      if (getMessageDatabase('all_items')[message]) {
        const newItem = getMessageDatabase('all_items')[message];
        storage[id].items.push(newItem); // adiciona o item ao carrinho;

        //////////////////////
        //Apenas para deixar o chatbot mais interessante para apresentação, depois vou apagar, pois não faz sentido:
        const allItems = [
          '1️⃣ → Pequena: R$ 20,00',
          '2️⃣ → Média: R$ 25,00',
          '3️⃣ → Grande: R$ 30,00',
          '4️⃣ → Família: R$ 35,00'
        ];
        //////////////////////
        // //Por enquanto apenas envia para um atendente, mas da para criar mais coisas ao invés de enviar para atendente de imadiato
        storage[id].stage = 3; // vai para o stage do atendente
        return `${allItems[(Number(message) - 1)]}\n` +
          '——————————\n' +
          'Ótima escolha!\n' +
          getMessageDatabase('attendant_stage')?.message_1;
        //////////////////////
      }
      else {
        return 'Digite uma opção válida, por favor. 🙋‍♀️';
      }
    })();

    // armazena o que o cliente falou e o que o bot respondeu para ter controle do que está acontecendo e como melhorar caso necessário
    storage[id].trackRecordResponse.push({
      id,
      currentStage: 2,
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