import { storage } from '../storage.js';
import { getMessageDatabase } from '../../../db_exemple/local_database.js';

export const stageOne = {
  async exec({ id, message }: { id: string, message: string }): Promise<{ nextStage: number; order: {}; response: string }> {


  },
}