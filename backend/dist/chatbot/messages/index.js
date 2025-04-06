import { getAllMessages } from "../../database/queries/select.js";
const messagesCache = {};
let timer = null;
const clearTimer = () => {
    if (timer) {
        clearTimeout(timer);
        timer = null;
    }
};
const setTimer = () => {
    console.log('@@@@@@@@@@@@@@@@ BANCO DE DADOS');
    clearTimer();
    timer = setTimeout(() => {
        Object.keys(messagesCache).forEach(key => delete messagesCache[key]);
    }, 5 * 60 * 1000);
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
    else {
        console.log('@@@@@@@@@@@@@@@@ CACHE');
    }
    return messagesCache[cacheKey]?.content || '';
};
export const getAllCachedMessages = async (chatbotId) => {
    if (Object.keys(messagesCache).length === 0) {
        const allMessages = await getAllMessages(chatbotId);
        allMessages.forEach(message => {
            messagesCache[`${message.stage}_${message.message_number}`] = message;
        });
        setTimer();
    }
    else {
        console.log('@@@@@@@@@@@@@@@@ CACHE');
    }
    return Object.values(messagesCache);
};
