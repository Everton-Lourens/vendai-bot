const { logger } = require('../../logger.js');

const { storage } = require('../storage.js');
//import { listOfStore, checkStatusChatbot } from './getItems.js';
const { listOfStore } = require('./getItems.js');
const { msgStage } = require('./msgResponse.js');
const {daysDifference} = require('../../site/middlewares/payment/daysDifference.js');

// define o objeto 'initialStage' que possui um método 'exec'
module.exports.initialStage = {
  async exec({ self, from, client_name }) {
    const from_client = from;
    try {

      // const statusChatbot = await checkStatusChatbot(from_client);
      return await wellcome();

      async function wellcome() {
        // envia para o stage 1, lá fará a escolha do processo;
        storage[from_client].stage = 1;
        storage[from_client].obj_store = {}; // zera caso o cliente deseje pedir outro atendente

        // Recebe uma lista do nome das lojas
        const listAllStore = await listOfStore({ from: from_client, numberChatbot: self });
        // Caso tenha apenas 1 retorna apenas 1 objeto e não uma Array List
        const itsJustOneStore = typeof listAllStore === 'object' && !Array.isArray(listAllStore.obj_store);
        // É um objeto e não é um array (Só tem 1 Loja)
        if (itsJustOneStore) {
          return await oneStore();
        } else {
          return await manyStore();
        }

        async function oneStore() {
          const lackOfPayment = await daysDifference(listAllStore.due_date);
          // confere se pagou o bot se se não pagou desativa...
          if (lackOfPayment || !listAllStore.chatbot_number) {
            logger.error('CHATBOT DESATIVADO!' + ' - NUMERO DO CHATBOT::::: ' + self);
            return 'CHATBOT DESATIVADO!';
          }
          // pega o único objeto store que foi cadastrada e coloca no storage do cliente
          storage[from_client].obj_store = listAllStore;
          // Como só tem uma Loja. retorna a mensagem do stage 1
          const { message_1 } = msgStage[1];
          // msg de bem-vindo + msg do stage 1 (fazer pedido) direto já que só tem 1 loja
          return `Olá, *${client_name ?? 'tudo bem?'}*\n` + message_1;
        }

        async function manyStore() {
          const lackOfPayment = await daysDifference(listAllStore.obj_store[0].due_date);
          // confere se pagou o bot se se não pagou desativa...
          if (lackOfPayment || !listAllStore.obj_store[0].chatbot_number) {
            logger.error('CHATBOT DESATIVADO!' + ' - NUMERO DO CHATBOT::::: ' + self);
            return 'CHATBOT DESATIVADO!';
          }
          const listNameStore = listAllStore?.listNameStore;
          const obj_store = listAllStore?.obj_store;
          // Armazena todas as Lojas no storage do cliente
          storage[from_client].obj_store = obj_store; ///////////// aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
          // se tiver mais que 1 loja, retorna true e mostra Array List com os nomes das lojas
          const { message_1 } = msgStage[0];
          message_1 + '\n' + // Mensagem padrão
            listNameStore; // nome das lojas e as opções para escolher uma loja
          if (!listNameStore || !listNameStore?.length)
            storage[from_client].attendant = true;
          // Retorna as opções de loja que ele deseja ser atendido
          return message_1 + '\n' + listNameStore;
        }
      }

    } catch (error) { // envia e armazena no stage error
      console.trace(error);
      logger.error('*Error stage 0::::*\n' + error.message + `\nClient Number: *${from.replace('@c.us', '')}*`);
      ///await client.sendText('557181768164@c.us', '*Error stage 0::::*\n' + error.message + `\nClient Number: *${from.replace('@c.us', '')}*`);
      storage[from].attendant = true;
      return '557181768164@c.us', '*Error stage 0::::*\n' + error.message + `\nClient Number: *${from.replace('@c.us', '')}*`;
    }




  },
};