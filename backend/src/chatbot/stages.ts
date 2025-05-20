import { ChatbotClient } from '../entities/chatbot';
import {
  initialStage,
  stageOne,
  stageTwo,
  stageThree,
} from './stages/index';
import { storage } from './storage';

interface Order {
  stage: number;
  wantsHumanService: boolean;
  items: any[];
  address: null;
}

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

  const order: Order = {
    stage: client.stage ?? 0,
    wantsHumanService: false,
    items: [],
    address: null,
  };
  storage[client.clientId] = order;
  return storage[client.clientId].stage;
}
