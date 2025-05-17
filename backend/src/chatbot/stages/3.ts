import { storage } from '../storage.js';
import { getMessageDatabase } from '../../database/local_database.js';

type AllMessages = {
  stage: number,
  position: number,
  content: string
};

export const stageThree = {
  async exec({ id, message, chatbot_id }: { id: string, message: string, chatbot_id: string }):
  Promise<{ nextStage: number; order: {}; response: string; }> {

    //allMessages = allMessages || await getMessageDatabase('stage_0');
    const response: string = await (async () => {
      return getMessageDatabase('stage_3')?.position_1;
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