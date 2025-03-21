const { logger } = require('../../logger.js');

const { getItemsInit, value_erro, getAllNeighborhood } = require('./getItems.js');
const { storage } = require('../storage.js');
const { msgStage } = require('./msgResponse.js');

module.exports.stageOne = {
  // O método "exec" recebe três parâmetros: "from", "message" e "client"
  async exec({ from, message, client_name }) {
    const from_client = from;
    try {

      // Se não tiver escolhido a loja, a mensagem do cliente vem para essa função onde ele escolhe a loja
      const chooseFromArrayOfStores = Array.isArray(storage[from_client].obj_store);
      // Não é um objeto e é um array (Tem mais de 1 Loja para escolher agora)
      if (chooseFromArrayOfStores) {
        await choosingStore(message);
        const { message_1 } = msgStage[1];
        return `Olá, *${client_name ?? 'tudo bem?'}*\n` + message_1;
      } else {

        const showInitialItems = message === '1' || message === '1️⃣' || message === '*' || message === '*️⃣';
        const showNeighborhood = message === '2' || message === '2️⃣' || message === '0' || message === '0️⃣';
        const speakToAttendant = message === '3' || message === '3️⃣';

        if (showInitialItems) {
          storage[from_client].stage = 2;
          storage[from_client].menuCount = 0; // Zera caso o cliente tenha olhado o valor dos bairros

          const msgResponse = await getItemsInit({ from: from_client, showItems: true, theChosen: null });
          return msgResponse;

        } else if (showNeighborhood) {
          const { message_2 } = msgStage[1];
          const neighborhood = await getAllNeighborhood(from_client);

          const msgResponse = (
            neighborhood +
            '\n*——————————*\n' +
            message_2
          );

          return msgResponse;

        } else if (speakToAttendant) {
          // envia para falar com atendente
          storage[from_client].attendant = true;
          return;
        }
        return await value_erro(from_client); // chama função que retorna uma mensagem: número inválido
      }

      async function choosingStore(number) {
        try {
          if (number === '0' || number === '0️⃣') {// Não existe a opção '0' para o cliente, se não seria convertido para "-1" na próxima etapa
            number = '1';
          }
          const storeChosen = parseInt(number) - 1;
          if (!isNaN(storeChosen)) {
            const arrayStores = storage[from_client].obj_store;
            // Verifica se a variável number é uma chave (propriedade) existente no objeto obj_stores
            if (storeChosen in arrayStores) {
              // Armazena o objeto Loja que o cliente escolheu
              storage[from_client].obj_store = arrayStores[storeChosen];
            } else {
              // Caso tenha digitado opção inválida ou não tenha telefone definido, adiciona o número principal da loja
              storage[from_client].obj_store = arrayStores['0'];
            }
          } else {
            // Caso ocorra um erro ao buscar as lojas, adiciona o número principal da loja
            storage[from_client].obj_store = arrayStores['0'];
          }
        } catch (error) {
          // Caso ocorra um erro ao buscar as lojas, adiciona o número principal da loja
          storage[from_client].obj_store = arrayStores['0'];
        }
      }

    } catch (error) { // envia e armazena no stage error
      console.trace(error);
      logger.error('*Error stage 1::::*\n' + error.message + `\nClient Number: *${from.replace('@c.us', '')}*`);
      ///await client.sendText('557181768164@c.us', '*Error stage 1::::*\n' + error.message + `\nClient Number: *${from.replace('@c.us', '')}*`);
      logger.error('557181768164@c.us', '*Error stage 1::::*\n' + error.message + `\nClient Number: *${from.replace('@c.us', '')}*`);
      storage[from].attendant = true;
      return;
    }
  },
};