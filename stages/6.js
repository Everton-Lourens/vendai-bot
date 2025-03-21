const { logger } = require('../../logger.js');

const { storage } = require('../storage.js');
const { getItemsInit, cleanStorage } = require('./getItems.js');

// Exportando um objeto que possui uma função 'exec' que será executada posteriormente
module.exports.paymentStage = {
  async exec({ from, message }) {
    const from_client = from;
    try {
        if (message === '*') {
          storage[from_client].stage = 2;
          await cleanStorage(from_client);
          const msgResponse = await getItemsInit(from_client);

          ///await client.sendText(from_client, msgResponse);
          return msgResponse;
        }

        if (message == '1' || message == '1️⃣') {
          message = 'PIX';
        } else if (message == '2' || message == '2️⃣') {
          message = 'DINHEIRO';
        } else if (message == '3' || message == '3️⃣') {
          message = 'CARTÃO';
        } else {
          message = 'A CONFIRMAR';
        }

        storage[from_client].attendant = true;

        const phone = from_client.split('@');
        // Criando a string do pedido
        const order = storage[from_client].order.replace('\n\n*OBS:::O cliente não finalizou o pedido*', '');

        const orderResponse = '🔔 *NOVO PEDIDO CONFIRMADO* 🔔\n' +
          '*~~~~~~~~~~~~~~~~~~~~~~*\n' +
          order +
          '📞–Cliente: +' + phone[0] + '\n' +
          '💸–```Pagamento```: *' + message + '.*';
        // Armazenando a string do pedido no objeto "storage" com a chave "from"
        storage[from_client].order = orderResponse;

        return orderResponse;

    } catch (error) { // envia e armazena no stage error
      logger.error('*Error stage 6::::*\n' + error.message + `\nClient Number: *${from.replace('@c.us', '')}*`);
      logger.error('557181768164@c.us', '*Error stage 6::::*\n' + error.message + `\nClient Number: *${from.replace('@c.us', '')}*`);
      storage[from_client].attendant = true;
      return;
    }
  },
};