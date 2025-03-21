const { logger } = require('../../logger.js');

const { organizeAllItems, getItemsInit, cleanStorage, value_erro, getAllBebidas } = require('./getItems.js');
const { msgStage } = require('./msgResponse.js');
const { storage } = require('../storage.js');
// @@@@@@@@@@@@@@@@@@@@@@ const { getAllDB } = require('../../repositories/deliverys.js');

// Exporta o objeto 'stageTwo'
module.exports.stageFour = {
   // Declara a função 'exec' que recebe os parâmetros 'from' e 'message'
   async exec({ from, message }) {
      const from_client = from;
      try {
         const { message_1 } = msgStage[4];

         const returnToHome = message === '*' || message === '*️⃣';
         const askForAddress = message === '#' || message === '#️⃣';
         const showMoreDrinks = message === '0' || message === '0️⃣';

         if (returnToHome) {
            storage[from_client].stage = 2;
            await cleanStorage(from_client);
            const msgResponse = await getItemsInit({ from: from_client, showItems: true, theChosen: null });
            return msgResponse;
         } else if (askForAddress) {
            storage[from_client].menuCount = 0;
            storage[from_client].stage = 5;
            // zera os erros desse stage
            storage[from_client].errorChoose = 0;
            // Zera a lista do cando de dados
            storage[from_client].listOfBebida = [];

            const msgAndress = message_1;
            return msgAndress;
         } else if (showMoreDrinks) {
            let allBebidas = await getAllBebidas({ from: from_client, showItems: true, theChosen: null });
            if (!allBebidas) {
               storage[from_client].menuCount = 0;
               storage[from_client].stage = 5;
               // zera os erros desse stage
               storage[from_client].errorChoose = 0;
               const msgAndress = message_1;
               allBebidas = msgAndress;
            }
            ///await client.sendText(from_client, allBebidas);
            return allBebidas;
         } else {
            const itemChosen = parseInt(message) - 1;
            if (isNaN(itemChosen)) {
               return await invalidChoice();
            }

            const chosenItem = await getAllBebidas({ from: from_client, showItems: false, theChosen: itemChosen });

            if (chosenItem[0]) {
               // Se o código for válido, adiciona o item correspondente no array 'items' do cliente no objeto 'storage'
               storage[from_client].items.push(chosenItem[0]);
            } else {
               return await invalidChoice();
            }
            async function invalidChoice() {
               const msgError = await value_erro(from_client); // chama função que retorna uma mensagem: número inválido
               return msgError;
            }

            // Criando uma string que contém a descrição de cada sabor de bolo pedido pelo cliente
            let items_of_bebida = await organizeAllItems(storage[from_client].items);

            //❌❌❌❌❌❌❌APAGAR??❌❌❌❌❌❌❌❌❌storage[from_client].chose_bebidas = items_of_drink; // Informa que  o sabor já foi escolhido adicionando algo np stage
            // envia o cliente para digitar o endssereço
            storage[from_client].stage = 5;
            // ARMAZENANDO PARA CASO O CLIENTE NÃO RESPONDA, ENVIA PARA ATENDENTE
            storage[from_client].order = items_of_bebida + '\n\n*OBS:::Cliente não informou endereço*';
            // zera os erros desse stage
            storage[from_client].errorChoose = 0;
            // Zera a lista do cando de dados
            storage[from_client].listOfBebida = [];
            // Retorna uma mensagem informando que o item foi asdicionado com sucesso e mostra as opções de pedido
            const msgResponse = (
               `${items_of_bebida}\n` +
               '*~~~~~~~~~~~~~~~~~~~~~~*\n\n' +
               message_1
            );

            return msgResponse;
         }

      } catch (error) {
         console.trace(error);
         logger.error('eeeee - ERRO 4:::' + error.message + `\nClient Number: *${from.replace('@c.us', '')}*`);
         logger.error('557181768164@c.us', '*Error stage 4::::*\n' + error.message + `\nClient Number: *${from.replace('@c.us', '')}*`);
         storage[from].attendant = true;
         return;
      }
   },
};