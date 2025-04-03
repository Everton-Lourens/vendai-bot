import { initialStage, stageOne, stageTwo, stageThree, } from './stages/index.js';
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
    {
        description: 'Attendant stage',
        stage: stageThree,
    },
];
export const getStage = async ({ id, stage }) => {
    const order = {
        stage: stage ?? 0,
        wantsHumanService: false,
        items: [],
        address: null,
        trackRecordResponse: [],
    };
    storage[id] = order;
    return storage[id].stage;
};
