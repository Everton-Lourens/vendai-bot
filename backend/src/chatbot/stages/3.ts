import { storage } from '../storage.js';
import { getMessageDatabase } from '../../database/local_database.js';

export const stageThree = {
  async exec({ id, message, allMessages }: { id: string, message: string, allMessages: object }):
  Promise<{ nextStage: number; order: {}; response: string; }> {

    const response: string = await (async () => {
      return getMessageDatabase('stage_3')?.message_1;
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
      response,
      order: storage[id]
    };

  },
}