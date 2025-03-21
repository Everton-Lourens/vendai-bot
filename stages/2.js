const { logger } = require('../../logger.js');

const { organizeAllItems, sendMenu, value_erro, getItemsInit, addItem } = require('./getItems.js');
const { storage } = require('../storage.js');
// @@@@@@@@@@@@@@@@@@@@@@ const { getAllDB } = require('../../../src/repositories/deliverys.js');

// Exporta o objeto 'stageTwo'
module.exports.stageTwo = {
   async exec({ from, message }) {
      const from_client = from;
      try {
         const showMoreInitialItems = message === '0' || message === '0️⃣';
         if (showMoreInitialItems) {
            return await getItemsInit({ from: from_client, showItems: true, theChosen: null });
         }
         const itemChosen = parseInt(message) - 1;
         if (isNaN(itemChosen)) {
            return await invalidChoice();
         }
         const chosenItem = await getItemsInit({ from: from_client, showItems: false, theChosen: itemChosen });

         if (chosenItem?.length) {
            storage[from_client].items = chosenItem;
         } else {
            return await invalidChoice();
         }
         // Organiza os items para mostrar ao cliente em uma "comanda"
         const items_of_size = await organizeAllItems(storage[from_client].items);
         // envia para stage 3 escolher os sabores
         storage[from_client].stage = 3;
         // zera os erros desse stage
         storage[from_client].errorChoose = 0;
         const number_flavor = storage[from_client].items[0].number_flavor;

         const msgResponse = (
            `${items_of_size}\n` +
            '*.............................*\n\n' +
            '*–>* ADICIONE ATÉ *' + (number_flavor === 1 ? "1 OPÇÃO:*" : `${number_flavor} OPÇÕES:*`) + '\n\n'
         );

         storage[from_client].menuCount = 0;
         let menu = await sendMenu({ from: from_client, showItems: true, theChosen: null });
         if (!menu) {
            menu = '\n\n*SABORES NÃO CADASTRADOS*';

            storage[from_client].order =
               '*MeganBot informa:*\n\n' +

               '*NÃO FOI CADASTRADO NENHUM\n' +
               'SABOR PARA ESTA PIZZA.*\n' +
               'Acesse o site para cadastar:\n' +
               'meganbot.com.br/login\n\n' +

               'Confira a escolha do cliente\n' +
               'e continue o atendimento:\n' +
               msgResponse + menu;

            storage[from_client].attendant = true;
         }

         return msgResponse + menu;

         async function invalidChoice() {
            storage[from_client].items = [];
            return await value_erro(from_client); // chama função que retorna uma mensagem: número inválido
         }

      } catch (error) { // envia e armazena no stage error
         console.trace(error);
         logger.error('*Error stage 2::::*\n' + error.message + `\nClient Number: *${from.replace('@c.us', '')}*`);
         ///await client.sendText('557181768164@c.us', '*Error stage 2::::*\n' + error.message + `\nClient Number: *${from.replace('@c.us', '')}*`);
         logger.error('557181768164@c.us', '*Error stage 2::::*\n' + error.message + `\nClient Number: *${from.replace('@c.us', '')}*`);
         storage[from].attendant = true;
         return;
      }
   },
};