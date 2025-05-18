import { Message } from '../../entities/chatbot';
import { storage } from '../storage';
import { BodyResponseChatbot } from './0';

export const stageThree = {
  async exec({ message, userId, clientId }: Message): Promise<BodyResponseChatbot> {

    //allMessages = allMessages || await getMessageDatabase('stage_0');
    const response: string = await (async () => {
      return 'Obrigado por comprar conosco!';
      //return getMessageDatabase('stage_3')?.position_1;
    })();

    return {
      nextStage: storage[clientId].stage,
      response,
      order: storage[clientId]
    };

  },
}