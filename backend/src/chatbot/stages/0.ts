import { container } from 'tsyringe';
import { storage } from '../storage';
import { ListMessageService } from '../../useCases/Message/ListMessages/ListMessageService.service';
import { ChatbotClient, NewClient } from '../../entities/chatbot';
import { ChatbotMessages } from '../messages';

export interface ResponseStage {
  respondedClient: NewClient
}

export const initialStage = {
  async exec({ client }: ChatbotClient): Promise<ResponseStage> {

    const chatbotMessages = new ChatbotMessages({ client });
    await chatbotMessages.getMessage({ stage: 0, position: 1 });
    const response = chatbotMessages.messages;

    storage[client.clientId].stage = 1;

    const respondedClient = {
      ...client,
      stage: storage[client.clientId].stage,
      order: storage[client.clientId].order,
      response,
    }
    return { respondedClient };
  },
}