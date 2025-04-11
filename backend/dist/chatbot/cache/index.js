import { getAllMessages, getAllItems } from "../../database/queries/select.js";
const messagesCache = {};
const itemsCache = {};
let timer = null;
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
export const getOneCachedMessage = async ({ chatbot_id, stage, message_number }) => {
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
export const getAllCachedMessages = async (chatbot_id) => {
    if (Object.keys(messagesCache).length === 0) {
        const allMessages = await getAllMessages(chatbot_id);
        allMessages.forEach(message => {
            messagesCache[`${message.stage}_${message.message_number}`] = message;
        });
        setTimer();
    }
    return Object.values(messagesCache);
};
export const getAllCachedItems = async (chatbot_id) => {
    if (!itemsCache[chatbot_id]) {
        const allItems = await getAllItems(chatbot_id);
        itemsCache[chatbot_id] = allItems;
        setTimer();
    }
    return itemsCache[chatbot_id];
};
