const { storage } = require('../storage.js');
const { findByForeignKeyId } = require('../../database/CRUD.js');
// @@@@@@@@@@@@@@@@@@@@@@ const { findModelByIdDB, getAllDB, getForColumnDB } = require('../../../src/repositories/deliverys.js');

module.exports.getItemsInit = async ({ from, showItems, theChosen }) => {
   var LIMIT = showItems ? 5 : 1;
   let items_init = '';
   let listOfMenusize = [];
   storage[from].listOfSabor = [];
   storage[from].listOfBebida = [];
   const skip = (!theChosen && theChosen != '0') ? storage[from].menuCount : theChosen;

   const franquia_id = storage[from].franquia_id;

   if (!storage[from].listOfMenusize?.length) {
      storage[from].listOfMenusize = await findByForeignKeyId({ router: 'menusize', id: franquia_id, status: true });
      storage[from].listOfMenusize = storage[from].listOfMenusize?.rows;
      if (!storage[from].listOfMenusize?.length)
         storage[from].attendant = true;
   }

   listOfMenusize = storage[from].listOfMenusize;
   storage[from].listOfMenusize = listOfMenusize;

   let arrayMenusize = myLimitOffset(listOfMenusize, LIMIT, skip);


   if (!arrayMenusize?.length) { // PARA EVITAR ERRO CASO O CLIENTE PEÇA UM PRODUTO E NÃO ESTEJA NA MEMÓRIA
      arrayMenusize = await findByForeignKeyId({ router: 'menusize', id: franquia_id, status: true, limit: LIMIT, offset: skip });
      arrayMenusize = arrayMenusize?.rows;
   }

   if (Array.isArray(arrayMenusize) && showItems) {
      items_init = await organizeWithNumbers({ from: from, objectMenu: arrayMenusize });
   } else if (!showItems) {
      //storage[from].listOfMenusize = [];
      return arrayMenusize;
   }


   if (items_init) {
      items_init = '*————* TAMANHOS *————*\n' +
         items_init +
         '*——————————*\n' +
         '*️⃣ *→* ```Reiniciar pedido```\n'+
         '0️⃣ *–> MAIS OPÇÕES...*';
   } else {
      if (storage[from].menuCount > 0) {
         items_init = '*Escolha uma opção acima.*\n' +
            '*São apenas esses tamanhos.*';
      } else {
         items_init = false;
      }
   }
   // OK
   return items_init;
}//


module.exports.sendMenu = async ({ from, showItems, theChosen }) => {
   try {
      var LIMIT = showItems ? 5 : 1;
      let items_flavor = '';
      let listOfSabor = [];
      storage[from].listOfMenusize = [];
      storage[from].listOfBebida = [];
      //const skip = ! isNaN(theChosen) ? theChosen : storage[from].menuCount;
      const skip = (!theChosen && theChosen != '0') ? storage[from].menuCount : theChosen;

      const menusize_id = storage[from].items[0].id;

      if (!storage[from].listOfSabor?.length) {
         storage[from].listOfSabor = await findByForeignKeyId({ router: 'sabor', id: menusize_id, status: true });
         storage[from].listOfSabor = storage[from].listOfSabor?.rows;
      }

      listOfSabor = storage[from].listOfSabor;
      storage[from].listOfSabor = listOfSabor;

      let arrayFlavors = myLimitOffset(listOfSabor, LIMIT, skip);


      if (!arrayFlavors?.length) { // PARA EVITAR ERRO CASO O CLIENTE PEÇA UM PRODUTO E NÃO ESTEJA NA MEMÓRIA
         arrayFlavors = await findByForeignKeyId({ router: 'sabor', id: menusize_id, status: true, limit: LIMIT, offset: skip });
         arrayFlavors = arrayFlavors?.rows;
      }

      if (Array.isArray(arrayFlavors) && showItems) {
         items_flavor = await organizeWithNumbers({ from: from, objectMenu: arrayFlavors });
      } else if (!showItems) {
         //storage[from].listOfSabor = [];
         return arrayFlavors;
      }

      if (items_flavor) {
         items_flavor = '*————* SABORES *————*\n' +
            items_flavor +
            '*——————————*\n' +
            '*️⃣ *→* ```Reiniciar pedido```\n'+
            '0️⃣ *–> MAIS OPÇÕES...*';
      } else {

         if (storage[from].menuCount > 0) {
            items_flavor = '*Escolha uma opção acima.*\n' +
               '*São apenas esses sabores.*';
         } else {
            items_flavor = false;
         }
      }
      return items_flavor;

   } catch (error) {

   }
}//FECHA sendMenu()

module.exports.getAllBebidas = async ({ from, showItems, theChosen }) => {
   var LIMIT = showItems ? 5 : 1;
   let items_drinks = '';
   let listOfBebida = [];
   try {
      storage[from].listOfMenusize = [];
      storage[from].listOfSabor = [];
   } catch (error) {
   }

   //const skip =  !isNaN(theChosen) ? theChosen : storage[from].menuCount;
   const skip = (!theChosen && theChosen != '0') ? storage[from].menuCount : theChosen;

   const franquia_id = storage[from].franquia_id;

   if (!storage[from].listOfBebida?.length) {
      storage[from].listOfBebida = await findByForeignKeyId({ router: 'bebida', id: franquia_id, status: true });
      storage[from].listOfBebida = storage[from].listOfBebida?.rows;
   }

   listOfBebida = storage[from].listOfBebida;
   storage[from].listOfBebida = listOfBebida;

   let arrayBebida = myLimitOffset(listOfBebida, LIMIT, skip);

   if (!arrayBebida?.length) { // PARA EVITAR ERRO CASO O CLIENTE PEÇA UM PRODUTO E NÃO ESTEJA NA MEMÓRIA
      arrayBebida = await findByForeignKeyId({ router: 'bebida', id: franquia_id, status: true, limit: LIMIT, offset: skip });
      arrayBebida = arrayBebida?.rows;
   }

   if (Array.isArray(arrayBebida) && showItems) {
      items_drinks = await organizeWithNumbers({ from: from, objectMenu: arrayBebida });
   } else if (!showItems) {
      //storage[from].listOfBebida = [];
      return arrayBebida;
   }

   if (items_drinks) {
      items_drinks = '*——* ADICIONA BEBIDA? *——*\n' +
         items_drinks +
         '*——————————*\n' +
         '0️⃣ *–> MAIS OPÇÕES...*\n' +
         '#️⃣– ❌```SEM BEBIDA```';
   } else {
      if (storage[from].menuCount > 0) {
         items_drinks = '*Escolha uma opção acima.*\n' +
            '*São apenas essas bebidas.*';
      } else {
         items_drinks = false;
      }
   }
   return items_drinks;
}

module.exports.getAllNeighborhood = async (from) => {
   let neighborhood = await organize();

   if (neighborhood) {
      neighborhood = '*————* BAIRROS *————*\n' +
         neighborhood +
         '*——————————*\n' +
         '0️⃣ *–> MAIS BAIRROS...*';
   } else {
      neighborhood = '*São apenas esses bairros.*';
   }
   return neighborhood;

   async function organize() {
      let items = '';
      let loja_id = storage[from].obj_store.id;
      /* NÃO FUNCIONA MAIS
      if (!_id) {
         _id = '0';
      }*/
      // let objectneighborhood = await findModelByIdDB.exec({ model: 'neighborhood', status: true, nameDBForein: 'loja', foreinKey: menusize_id });

      const skip = storage[from].menuCount;
      const obj_neighborhood = await findByForeignKeyId({ router: 'bairro', id: loja_id, status: true, limit: 5, offset: skip });
      //const obj_neighborhood = await findModelByIdDB.exec({ model: 'neighborhood', status: true, nameDBForein: 'loja', foreinKey: loja_id, skip: skip, limit: 5 });

      if (obj_neighborhood.rows) {
         Object.values(obj_neighborhood.rows).forEach((item, index) => {

            storage[from].menuCount++;
            // Verifica se é o último item da lista para decidir se deve colocar uma vírgula ou um ponto final
            if (index == Object.values(obj_neighborhood.rows).length - 1) {  // É O ULTIMO ITEM DA LISTA
               // É O ULTIMO ITEM DA LISTA
               if (!item.price) {
                  items += '*' + '– ' + item.description + '*\n';
               } else {
                  items += '*' + '– ' + item.description + '* (```R$' + item.price + ',00```)' + '\n';
               }
            } else {
               if (!item.price) {
                  items += '*' + '– ' + item.description + '*\n';
               } else {
                  items += '*' + '– ' + item.description + '* (```R$' + item.price + ',00```)' + '\n';
               }
            }
         });
      }
      return items;
   }
}


module.exports.listOfStore = async ({ from, numberChatbot }) => {
   return new Promise(async (resolve) => {
      try {
         let nameStore = '';
         let countAttendant = 0;

         const franquia_id = storage[from].franquia_id;
         const obj_stores = await findByForeignKeyId({ router: 'loja', id: franquia_id, status: true });

         //const obj_stores = await getForColumnDB.exec({ model: 'loja', status: true, franquia_id: franquia_id, column: 'chatbot', valueColumn: numberChatbot });
         obj_stores?.rows.forEach((item, index) => {
            if (item.name) {
               nameStore += '*' + getEmoticonNumber(index + 1) + '–> ' + item.name + '*\n';
               countAttendant++;
            }
         });

         if (countAttendant >= 2) {
            resolve({ listNameStore: nameStore, obj_store: obj_stores?.rows });
         } else {
            resolve(obj_stores?.rows[0]);  // Retorn 1 objeto loja
         }
      } catch (error) {
      }
   });
}

module.exports.cleanStorage = async (from) => {
   //storage[from].stage = 2; APAGUEI AGORA
   /////////////////////////////////////
   storage[from].previous_message = '';
   storage[from].chose_size = 0;
   storage[from].chose_flavor = '';
   storage[from].chose_bebidas = '';
   storage[from].items = [];
   storage[from].listOfMenusize = [];
   storage[from].listOfSabor = [];
   storage[from].listOfBebida = [];
   storage[from].address = '';
   storage[from].errorChoose = 0;
   storage[from].payment = '';
   storage[from].flavorQuantity = 0;
   storage[from].menuCount = 0;
   storage[from].taxa_entrega = null;
   storage[from].valor_total = null;
   //let msgResponse = '*::::::::::Observação::::::::::*\n\nPor exemplo: *Se você digitar a opção N° 7 do cardápio*, eu vou adicionar na sua lista:\n*.......................................*\n ––SUA LISTA DE ITEmS––\n🍟 *Batata*\n🍕 *Mussarela*\n🥤 *Refrigerante –>* ✅ ```Adicionado!```\n*.......................................*\n*Adicione quantas opções quiser!*\n⚠️ ```APENAS UMA OPÇÃO POR VEZ``` ⚠️\n*_______________________*\n0️⃣ *→* ```FALAR C/ ATENDENTE```';
   return;
}


function myLimitOffset(arrayData, limit, offset) {
   try {
      // Verifica se o offset está dentro dos limites da array
      if (offset < 0 || offset >= arrayData?.length || !Array.isArray(arrayData)) {
         return [];
      }
      // Aplica o offset
      const offsetArray = arrayData.slice(offset);

      // Aplica o limit
      const resultArray = offsetArray.slice(0, limit);

      return resultArray;

   } catch (error) {
      console.error(error.message);
      // Trate o erro conforme necessário ou simplesmente retorne uma array vazia
      return [];
   }
}




module.exports.value_erro = async (from) => {
   storage[from].errorChoose++;
   if (storage[from].errorChoose == 1) {
      return '❌ ```Escolha uma```  *OPÇÃO*';

   } else if (storage[from].errorChoose == 2) {
      return '❌ *Escolha uma opção válida, por favor.*';

   } else if (storage[from].errorChoose == 3) {
      storage[from].attendant = true;
      return;
   }
}

function getEmoticonNumber(number) {
   const numberEmojis = {
      '0': '0️⃣',
      '1': '1️⃣',
      '2': '2️⃣',
      '3': '3️⃣',
      '4': '4️⃣',
      '5': '5️⃣',
      '6': '6️⃣',
      '7': '7️⃣',
      '8': '8️⃣',
      '9': '9️⃣',
      '10': '🔟',
      '11': '1️⃣1️⃣',
      '12': '1️⃣2️⃣',
      '13': '1️⃣3️⃣',
      '14': '1️⃣4️⃣',
      '15': '1️⃣5️⃣',
      '16': '1️⃣6️⃣',
      '17': '1️⃣7️⃣',
      '18': '1️⃣8️⃣',
      '19': '1️⃣9️⃣',
      '20': '2️⃣0️⃣',
      '21': '2️⃣1️⃣',
      '22': '2️⃣2️⃣',
      '23': '2️⃣3️⃣',
      '24': '2️⃣4️⃣',
      '25': '2️⃣5️⃣',
      '26': '2️⃣6️⃣',
      '27': '2️⃣7️⃣',
      '28': '2️⃣8️⃣',
      '29': '2️⃣9️⃣',
      '30': '3️⃣0️⃣',
      '31': '3️⃣1️⃣',
      '32': '3️⃣2️⃣',
      '33': '3️⃣3️⃣',
      '34': '3️⃣4️⃣',
      '35': '3️⃣5️⃣',
      '36': '3️⃣6️⃣',
      '37': '3️⃣7️⃣',
      '38': '3️⃣8️⃣',
      '39': '3️⃣9️⃣',
      '40': '4️⃣0️⃣',
      '41': '4️⃣1️⃣',
      '42': '4️⃣2️⃣',
      '43': '4️⃣3️⃣',
      '44': '4️⃣4️⃣',
      '45': '4️⃣5️⃣',
      '46': '4️⃣6️⃣',
      '47': '4️⃣7️⃣',
      '48': '4️⃣8️⃣',
      '49': '4️⃣9️⃣',
      '50': '5️⃣0️⃣',
   };
   // Adicione quantos emojis forem necessários
   if (!number) {
      number = '-';
   }
   return numberEmojis[number] || number;
}

async function organizeWithNumbers({ from, objectMenu }) {
   if (!from) {
      throw new Error('( FROM ) ESTÁ VAZIO:::::: !from');
   }
   let items = '';
   Object.values(objectMenu).forEach((item, index) => {
      storage[from].menuCount++;
      let indexNumber = storage[from].menuCount;
      // Verifica se é o último item da lista para decidir se deve colocar uma vírgula ou um ponto final
      if (index == Object.values(objectMenu).length - 1) {  // É O ULTIMO ITEM DA LISTA
         // É O ULTIMO ITEM DA LISTA
         if (!item.price) {
            items += '*' + getEmoticonNumber(indexNumber) + '–> ' + item.description + '* \n*...........................*\n';
         } else {
            items += '*' + getEmoticonNumber(indexNumber) + '–> ' + item.description + '* (```R$' + item.price + ',00```)' + '\n*...........................*\n';
         }
      } else {
         if (!item.price) {
            items += '*' + getEmoticonNumber(indexNumber) + '–> ' + item.description + '* \n*...........................*\n';
         } else {
            items += '*' + getEmoticonNumber(indexNumber) + '–> ' + item.description + '* (```R$' + item.price + ',00```)' + '\n*...........................*\n';
         }
      }
   });
   return items;
}

module.exports.organizeAllItems = async (items) => {
   // Criando uma string que contém a descrição de cada sabor de bolo pedido pelo cliente
   let getAllItems = '';
   if (!items) {
      return null;
   }

   items.map((item, index) => {
      // Verifica se é o último item da lista para decidir se deve colocar uma vírgula ou um ponto final
      if (index == items.length - 1) { // É O ULTIMO ITEM DA LISTA
         if (item.price == 0) {
            getAllItems += '*✅–> ' + item.description + '*';
         } else {
            getAllItems += '*✅–> ' + item.description + '* (```R$' + item.price + ',00```)';
         }

      } else {  // NÃO É O ULTIMO ITEM DA LISTA
         if (item.price == 0) {
            getAllItems += '✅ *' + item.description + '*\n';
         } else {
            getAllItems += '✅ *' + item.description + '* (```R$' + item.price + ',00```)' + '\n';
         }
      }
   });

   return getAllItems;
}