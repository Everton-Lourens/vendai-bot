import {
  initialStage
} from './stages/index.js';

import { storage } from './storage.js';

export const stages = [
  {
    descricao: 'Welcome',
    stage: initialStage,
  }
];

export const getStage = async ({ id, stage }: { id: string, stage?: number }): Promise<number> => {

  const order: {
    stage: number,
    attendant: boolean,
    items: any[],
    address: null,
  } = {
    stage: stage ?? 0,
    attendant: false,
    items: [],
    address: null,
  };

  storage[id] = order;

  return storage[id].stage;
}

