import { container } from 'tsyringe';
import { storage } from '../storage';
import { ListMessageService } from '../../useCases/Message/ListMessages/ListMessageService.service';
import { ChatbotClient } from '../../entities/chatbot';

export interface ResponseStage {
  respondedClient?: {
    userId: string;
    clientId: string;
    stage: number;
    message: string;
    order: object;
    response: string;
  }
}

export const initialStage = {
  async exec({ client }: ChatbotClient): Promise<ResponseStage> {

    const welcomeMessage = await (async () => {
      try {
        const listMessageService = container.resolve(ListMessageService)
        const messages = await listMessageService.execute({
          searchString: '',
          //userId: '682a0547e82c591ac3a97d64',
          userId: client.userId,
        })
        return messages.find((message) => message.stage === 1 && message.position === 1)?.text || 'Erro ao buscar mensagem de boas-vindas';
      } catch (error) {
        return 'Erro ao buscar mensagem de boas-vindas';
      }
    })();

    // Para evitar o erro de \n estar com "\\n" no banco de dados
    const response = welcomeMessage?.replace(/\\n/g, '\n');

    // Envia para o stage 1
    storage[client.clientId].stage = 1;

    const respondedClient = {
      ...client,
      stage: storage[client.clientId].stage,
      response,
      order: storage[client.clientId],
    }
    return { respondedClient };
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