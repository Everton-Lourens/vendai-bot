import { getAllMessages } from "../../database/queries/select.js";

const messagesCache: { [key: string]: { stage: number; message_number: number; content: string } } = {};
let timer: NodeJS.Timeout | null = null;

const clearTimer = () => {
    if (timer) {
        clearTimeout(timer);
        timer = null;
    }
};

const setTimer = () => {
    clearTimer();
    timer = setTimeout(() => {
        Object.keys(messagesCache).forEach(key => delete messagesCache[key]);
    }, 1 * 60 * 1000); // Armazenar as mensagens durante 1 minuto
};

export const getOneCachedMessage = async ({ chatbot_id, stage, message_number }: { chatbot_id: string, stage: number, message_number: number }): Promise<string> => {
    const cacheKey = `${stage}_${message_number}`;
    if (!messagesCache[cacheKey]) {
        const allMessages = await getAllMessages(chatbot_id);
        allMessages.forEach(message => {
            messagesCache[`${message.stage}_${message.message_number}`] = message;
        });
        setTimer();
    }
    return messagesCache[cacheKey]?.content || '';
};

export const getAllCachedMessages = async (chatbotId: string): Promise<{ stage: number; message_number: number; content: string }[]> => {
    if (Object.keys(messagesCache).length === 0) {
        const allMessages = await getAllMessages(chatbotId);
        allMessages.forEach(message => {
            messagesCache[`${message.stage}_${message.message_number}`] = message;
        });
        setTimer();
    }
    return Object.values(messagesCache);
};
