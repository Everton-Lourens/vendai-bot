import { storage } from '../storage.js';
import { getMessageDatabase } from '../../database/local_database.js';
import { getOneCachedMessage } from '../cache/index.js';

export const initialStage = {
  async exec({ id, message, chatbot_id }: { id: string, message: string, chatbot_id: string }):
    Promise<{ nextStage: number; response: string; order: {}; }> {

    const welcomeMessage = await (async () => {
      try {
        return await getOneCachedMessage({
          chatbot_id,
          stage: 0,
          message_number: 1
        });
      } catch (error) {
        return getMessageDatabase('stage_0')?.message_number_1;
      }
    })();

    // Para evitar o erro de \n estar com "\\n" no banco de dados
    const response = welcomeMessage.replace(/\\n/g, '\n');

    // envia para o stage 1
    storage[id].stage = 1;

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
      response,
      order: storage[id]
    };

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