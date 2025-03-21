const { logger } = require('../../logger.js');

const { getItemsInit, cleanStorage, getAllBebidas, organizeAllItems, sendMenu, value_erro } = require('./getItems.js');
const { msgStage } = require('./msgResponse.js');
const { storage } = require('../storage.js');
// @@@@@@@@@@@@@@@@@@@@@@ const { findModelByIdDB } = require('../../../src/repositories/deliverys.js');

// Exporta o objeto 'stageTwo'
module.exports.stageThree = {
   // Declara a função 'exec' que recebe os parâmetros 'from' e 'message'
   async exec({ from, message }) {
      const from_client = from;
      try {
         const returnToHome = message === '*' || message === '*️⃣';
         const showFlavors = message === '#' || message === '#️⃣';

         if (returnToHome) { // *
            storage[from_client].stage = 2;
            await cleanStorage(from_client);
            return await getItemsInit({ from: from_client, showItems: true, theChosen: null });
         } else if (showFlavors) { // #
            if (!storage[from_client].chose_flavor) {
               return '⚠️ *ESCOLHA AO MENOS 1 SABOR* ⚠️';
            } else {
               storage[from_client].menuCount = 0;
               // envia para escolher ou não uma bebida
               storage[from_client].stage = 4;///////////////////////////////////////////////
               // zera os erros desse stage
               storage[from_client].errorChoose = 0;
               // Zera a quantidade de sabores que pode escolher já que não quer mais sabores
               storage[from_client].items[0].number_flavor = 0;

               let items_drink = await getAllBebidas({ from: from_client, showItems: true, theChosen: null });

               if (!items_drink) {
                  storage[from_client].menuCount = 0;
                  storage[from_client].stage = 5;
                  // zera os erros desse stage
                  storage[from_client].errorChoose = 0;
                  const { message_1 } = msgStage[4];
                  const msgAndress = message_1;
                  items_drink = msgAndress;
               }
               return items_drink;
            }
         }
         const { number_flavor } = storage[from_client].items[0];

         if (number_flavor > 0) {  // se ainda for falso, entra aqui
            const showMoreFlavors = message === '0' || message === '0️⃣';
            if (showMoreFlavors) {
               return await sendMenu({ from: from_client, showItems: true, theChosen: null });
            }

            const itemChosen = parseInt(message) - 1;
            if (isNaN(itemChosen)) {
               return await invalidChoice();
            }

            const chosenItem = await sendMenu({ from: from_client, showItems: false, theChosen: itemChosen });
            //const chosenItem = await addItem({ router: 'sabor', foreinKey: menusize_id, itemChosen: itemChosen });
            //const chosenItem = await findModelByIdDB.exec({ model: 'sabores', status: true, nameDBForein: 'menusize', foreinKey: menusize_id, skip: itemChosen, limit: 1 });

            if (chosenItem[0]) {
               storage[from_client].items.push(chosenItem[0]);
            } else {
               return await invalidChoice();
            }

            async function invalidChoice() {
               const msgError = await value_erro(from_client); // chama função que retorna uma mensagem: número inválido
               ///await client.sendText(from_client, msgError);
               return msgError;
            }
            // Criando uma string que contém a descrição de cada sabor de bolo pedido pelo cliente
            const items_of_flavor = await organizeAllItems(storage[from_client].items);

            storage[from_client].chose_flavor = items_of_flavor; // Funciona para caso o cliente deseje finalizar o pedido, ele permite pois será true
            // Tira 1 opção de sabor para o cliente não escolher a mais
            storage[from_client].items[0].number_flavor--;

            const { number_flavor } = storage[from_client].items[0];
            if (number_flavor > 0) {

               let chooseMore;
               // Retorna uma mensagem informando que o item foi adicionado com sucesso e mostra as opções de pedido
               if (number_flavor > 1) {
                  chooseMore = (
                     '⚠️ *–>* ESCOLHA *MAIS  ' +
                     `${number_flavor}` + ' OPÇÕES*\n' +
                     '*DE SABORES* DO CARDÁPIO'
                  );
               } else {
                  // Retorna uma mensagem informando que o item foi adicionado com sucesso e mostra as opções de pedido
                  chooseMore = (
                     '⚠️ *–>* ```Você Ainda Pode Escolher```\n' +
                     '*1 OPÇÃO DE SABOR DO CARDÁPIO*'
                  );
               }
               const msgResponse = (
                  `${items_of_flavor}` +
                  '\n*~~~~~~~~~~~~~~~~~~~~~~*\n\n' +

                  `${chooseMore}\n\n` +

                  '*——————————*\n' +
                  '*️⃣ *→* ```Reiniciar pedido```\n' +
                  '0️⃣ *–> ADICIONAR OUTRO SABOR*\n' +
                  '#️⃣ *–> FINALIZAR*  ```pedido```'
               );

               storage[from_client].menuCount = 0; // Zera para o cliente ver os sabores do início novamente
               ///await client.sendText(from_client, msgResponse);
               return msgResponse;
            }
            //❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌storage[from].chose_flavor = items_of_flavor; // Informa que  o sabor já foi escolhido adicionando algo na string

            // envia o cliente para escolher a bebida
            storage[from_client].stage = 4;
            storage[from_client].menuCount = 0

            let allBebidas = await getAllBebidas({ from: from_client, showItems: true, theChosen: null });

            if (!allBebidas) {
               storage[from_client].stage = 5;
               storage[from_client].menuCount = 0

               const { message_1 } = msgStage[4]; // loja QUE O CLIENTE ESCOLHEU
               allBebidas = message_1; // Infor o Endereço
            }

            return allBebidas;
         }

      } catch (error) {
         console.trace(error);
         logger.error('eeeee - ERRO 3:::' + error.message + `\nClient Number: *${from.replace('@c.us', '')}*`);
         logger.error('557181768164@c.us', '*Error stage 3::::*\n' + error.message + `\nClient Number: *${from.replace('@c.us', '')}*`);
         storage[from].attendant = true;
         return;
      }
   },
};