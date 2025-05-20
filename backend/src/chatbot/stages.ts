import { ChatbotClient } from '../entities/chatbot';
import {
  initialStage,
  stageOne,
  stageTwo,
  stageThree,
} from './stages/index';
import { storage } from './storage';

export const stages = [
  {
    description: 'Welcome',
    stage: initialStage,
  },
  {
    description: 'Chatbot or human service?',
    stage: stageOne,
  },
  {
    description: 'Choose the items',
    stage: stageTwo,
  },
  {
    description: 'Attendant stage',
    stage: stageThree,
  },
];

export const getStage = async ({ client }: ChatbotClient): Promise<number> => {
  storage[client.clientId] = {
    ...client,
    stage: client.stage ?? 0,
  };
  return storage[client.clientId].stage;
}
