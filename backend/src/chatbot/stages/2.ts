import { storage } from '../storage';
//import { getResponseDatabase } from '../../database/local_database';
import { CartChatbot } from '../sale/cart';
import { ChatbotClient } from '../../entities/chatbot';
import { ChatbotMessages } from '../messages';

export const stageTwo = {
  async exec({ client }: { client: ChatbotClient }): Promise<{ respondedClient: ChatbotClient }> {
    const chatbotMessages = new ChatbotMessages({ client });

    const index = parseInt(client.message, 10);
    const arrayProduct = await chatbotMessages.getArrayProduct();
    if (isNaN(index) || index <= 0 || index > arrayProduct.length) {
      chatbotMessages.setResponse('Digite uma opção válida, por favor. 🙋‍♀️');
    } else {
      storage[client.clientId].stage = 3;
      storage[client.clientId].humanAttendant = true;
      const newItem = await chatbotMessages.getProductByCode(client.message);
      newItem.amount = 1;
      storage[client.clientId].order.items.push(newItem);
      const newProduct = {
        clientId: client.clientId,
        products: [newItem],
        paymentType: 'dinheiro',
        totalValue: newItem.value,
        userId: client.userId,
      };
      const cartChatbot = new CartChatbot(newProduct);
      const sale = await cartChatbot.checkout();
      if (!sale) {
        chatbotMessages.setResponse('Erro ao criar a venda. Tente novamente mais tarde.');
      } else {
        const awaitAttendantMessage = await chatbotMessages.getResponse(3, 1);
        chatbotMessages.setResponse(
          awaitAttendantMessage +
          '\n' +
          '——————————\n' +
          `Item: ${newItem.name}\n` +
          `Preço: R$${newItem.value},00\n` +
          '——————————'
        );
      }
    }
    const response = await chatbotMessages.getResponse();
    const respondedClient = {
      ...client,
      stage: storage[client.clientId].stage,
      order: storage[client.clientId].order,
      response,
    }
    return { respondedClient };
  },
}