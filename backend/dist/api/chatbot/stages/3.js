import { storage } from '../storage.js';
import { getMessageDatabase } from '../../../db_exemple/local_database.js';
export const stageThree = {
    async exec({ id, message }) {
        const response = await (async () => {
            return getMessageDatabase('attendant_stage')?.message_1;
        })();
        // armazena o que o cliente falou e o que o bot respondeu para ter controle do que está acontecendo e como melhorar caso necessário
        storage[id].trackRecordResponse.push({
            id,
            currentStage: 10,
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
};
