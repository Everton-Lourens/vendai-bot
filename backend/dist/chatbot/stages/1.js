import { storage } from '../storage.js';
import { getMessageDatabase, getAllItemsDatabase } from '../../database/local_database.js';
import { getAllCachedItems } from '../cache/index.js';
export const stageOne = {
    async exec({ id, message, chatbot_id }) {
        //allMessages = allMessages || await getMessageDatabase('stage_0');
        const response = await (async () => {
            if (message === '1') {
                storage[id].stage = 2; // stage da escolha dos itens
                const allItems = await (async () => {
                    try {
                        return await getAllCachedItems(chatbot_id);
                    }
                    catch (error) {
                        return getAllItemsDatabase('all_items');
                    }
                })();
                const itemsDescription = Object.values(allItems)
                    .map((item, index) => `${numberEmoji(index)} → ${item?.description}`)
                    .join('\n');
                return itemsDescription || 'Erro ao buscar itens do banco de dados';
            }
            else if (message === '2') {
                storage[id].stage = 1; // permanece nesse stage, apenas mostra a taxa de entrega
                return getMessageDatabase('delivery_tax')?.message_number_1;
            }
            else if (message === '3') {
                storage[id].wantsHumanService = true;
                storage[id].stage = 3; // vai para o stage do atendente
                return getMessageDatabase('attendant_stage')?.message_number_1;
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
            response,
            order: storage[id]
        };
    },
};
function numberEmoji(number) {
    const blueEmojis = [
        "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"
    ];
    if (number < 0 || number > 9) {
        return number;
    }
    return blueEmojis[number];
}
