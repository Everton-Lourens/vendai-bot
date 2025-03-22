import {
  initialStage,
  stageOne,
  stageTwo,
} from './stages/index.js';

import { storage } from './storage.js';

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
];

export const getStage = async ({ id, stage }: { id: string, stage?: number }): Promise<number> => {

  const order: {
    stage: number,
    wantsHumanService: boolean,
    items: any[],
    address: null,
    trackRecordResponse: any[],
  } = {
    stage: stage ?? 0,
    wantsHumanService: false,
    items: [],
    address: null,
    trackRecordResponse: [],
  };

  storage[id] = order;

  return storage[id].stage;
}

