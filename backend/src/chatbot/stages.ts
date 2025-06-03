import { ChatbotClient } from '../entities/chatbot';
import { initialStage, stageTwo, stageThree, stageFour } from './stages/index';
import { storage } from './storage';

export const stages = [
  {
    description: 'Welcome',
    stage: initialStage,
  },
  {
    description: 'Chatbot or human service?',
    stage: stageTwo,
  },
  {
    description: 'Choose the items',
    stage: stageThree,
  },
  {
    description: 'Attendant stage',
    stage: stageFour,
  },
];

export const getStage = async ({ client }: { client: ChatbotClient }): Promise<number> => {
  if (!client || !client.clientId || !client.userId) throw new Error('getStage: Client not found');

  if (client.stage > 0) {
    storage[client.clientId] = {
      ...client
    };
    return storage[client.clientId].stage;
  }
  const newClient = {
    stage: 0,
    userId: client.userId,
    clientId: client.clientId,
    message: client.message,
    order: {
      humanAttendant: false,
      items: [],
      address: null,
    },
    response: '',
  };
  storage[client.clientId] = newClient;
  return storage[client.clientId].stage;
}
