import { storage } from '../storage.js';
import { getMessageDatabase } from '../../database/local_database.js';
import { getOneCachedItem } from '../cache/index.js';
export const stageTwo = {
    async exec({ id, message, chatbot_id }) {
        //allMessages = allMessages || await getMessageDatabase('stage_0');
        const response = await (async () => {
            try {
                const getNewItem = await getOneCachedItem(chatbot_id, message);
                if (getNewItem === null)
                    return 'Digite uma opção válida, por favor. 🙋‍♀️';
                const itemName = getNewItem?.name;
                const itemDescription = getNewItem?.description;
                const itemPrice = getNewItem?.price;
                storage[id].items.push(getNewItem); // adiciona o item ao carrinho;
                storage[id].stage = 3; // vai para o stage do atendente
                storage[id].wantsHumanService = true; // vai para o stage do atendente
                return 'Ótima escolha!' + '\n' +
                    '——————————\n' +
                    `Item: ${itemName}\n` +
                    `Descrição: ${itemDescription}\n` +
                    `Preço: R$${itemPrice}\n` +
                    '——————————';
            }
            catch (error) {
                if (getMessageDatabase('all_items')[message]) {
                    const newItem = getMessageDatabase('all_items')[message];
                    storage[id].items.push(newItem); // adiciona o item ao carrinho;
                    const itemDescription = newItem?.description;
                    // //Por enquanto apenas envia para um atendente, mas da para criar mais coisas ao invés de enviar para atendente de imadiato
                    storage[id].stage = 3; // vai para o stage do atendente
                    storage[id].wantsHumanService = true; // vai para o stage do atendente
                    return 'Ótima escolha!\n' +
                        '——————————\n' +
                        `${itemDescription}\n` +
                        '——————————\n' +
                        getMessageDatabase('attendant_stage')?.message_number_1;
                    //////////////////////
                }
                else {
                    return 'Digite uma opção válida, por favor. 🙋‍♀️';
                }
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
            response,
            order: storage[id]
        };
    },
};
