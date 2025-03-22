import { storage } from '../storage.js';
import { getMessageDatabase } from '../../../db_exemple/local_database.js';

export const initialStage = {
  async exec({ id, message }: { id: string, message: string }): Promise<{ nextStage: number; order: {}; response: string }> {
    storage[id].stage = 1;

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

  },
}