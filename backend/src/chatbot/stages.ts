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

export const getStage = async ({ clientId, stage }: { clientId: string, stage?: number }): Promise<number> => {

  const order: {
    stage: number,
    wantsHumanService: boolean,
    items: any[],
    address: null,
  } = {
    stage: stage ?? 0,
    wantsHumanService: false,
    items: [],
    address: null,
  };

  storage[clientId] = order;

  return storage[clientId].stage;
}
