import { getAllMessages, getAllItems } from '../../database/postgres/queries/select';

const messagesCache: { [key: string]: { stage: number; position: number; content: string } } = {};
const itemsCache: { [key: string]: { id: string; name: string; description: string; price: number }[] } = {};
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
        Object.keys(itemsCache).forEach(key => delete itemsCache[key]);
    }, 1 * 60 * 1000); // Armazenar as mensagens e itens durante 1 minuto
};

export const getOneCachedMessage = async ({ chatbot_id, stage, position }: { chatbot_id: string, stage: number, position: number }): Promise<string> => {
    const cacheKey = `${stage}_${position}`;
    if (!messagesCache[cacheKey]) {
        const allMessages = await getAllMessages(chatbot_id);
        allMessages.forEach(message => {
            messagesCache[`${message.stage}_${message.position}`] = message;
        });
        setTimer();
    }
    return messagesCache[cacheKey]?.content || '';
};

export const getAllCachedMessages = async (chatbot_id: string): Promise<{ stage: number; position: number; content: string }[]> => {
    if (Object.keys(messagesCache).length === 0) {
        const allMessages = await getAllMessages(chatbot_id);
        allMessages.forEach(message => {
            messagesCache[`${message.stage}_${message.position}`] = message;
        });
        setTimer();
    }
    return Object.values(messagesCache);
};

export const getAllCachedItems = async (chatbot_id: string): Promise<{ id: string; name: string; description: string; price: number; }[]> => {
    if (!itemsCache[chatbot_id]) {
        const allItems = await getAllItems(chatbot_id);
        itemsCache[chatbot_id] = allItems;
        setTimer();
    }
    return itemsCache[chatbot_id];
};


export const getOneCachedItem = async (
    chatbot_id: string,
    item_number: string
): Promise<{ id: string; name: string; description: string; price: number } | null> => {
    if (!itemsCache[chatbot_id]) {
        const allItems = await getAllItems(chatbot_id);
        itemsCache[chatbot_id] = allItems;
        setTimer();
    }

    const index = parseInt(item_number, 10) - 1;

    const items = itemsCache[chatbot_id];

    if (isNaN(index) || index < 0 || index >= items?.length)
        return null;

    return items[index];
};
