import { ChatbotClient } from '../../entities/chatbot';
import { storage } from '../storage';
import { ResponseStage } from './0';

export const stageThree = {
  async exec({ client }: ChatbotClient): Promise<ResponseStage> {

    //allMessages = allMessages || await getMessageDatabase('stage_0');
    const response: string = await (async () => {
      return 'Obrigado por comprar conosco!';
      //return getMessageDatabase('stage_3')?.position_1;
    })();

    const respondedClient = {
      ...client,
      stage: storage[client.clientId].stage,
      response,
      order: storage[client.clientId],
    }
    return { respondedClient };
  },
}