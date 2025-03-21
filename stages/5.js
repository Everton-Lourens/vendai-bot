const { logger } = require('../../logger.js');

const { storage } = require('../storage.js');
const { findBySearchTerm } = require('../../database/CRUD.js');
// @@@@@@@@@@@@@@@@@@@@@@ const { findbairroDB } = require('../../../src/repositories/deliverys.js');

// Exporta um objeto chamado "stageAddress" contendo uma função assíncrona chamada "exec"
module.exports.stageAddress = {
  async exec({ from, message }) {
    const from_client = from;
    try {
      /*else if (message === '1' || message === '1️⃣') {// se for 1, então volta para adicionar a bebida que o cliente deseja

        storage[from_client].stage = 2;
        storage[from_client].chose_drink = '';

        let items_drink = '```ADICIONE SUA BEBIDA:```\n*~~~~~~~~~~~~~~~~~~~~~~*\n'

        Object.values(menu_drinks).forEach((item, index) => {
          // Verifica se é o último item da lista para decidir se deve colocar uma vírgula ou um ponto final
          if (index == Object.values(menu_drinks).length - 1) {
            items_drink += item.description + ' (```R$' + item.price + ',00```)';
          } else {
            items_drink += item.description + ' (```R$' + item.price + ',00```)\n\n';
          }
        });

        return items_drink + '\n' +
          '*——————————*\n' +
          '0️⃣– ❌```SEM Bebida```\n' +
          '*️⃣– ```REFAZER Pedido```';

        // 'ESCOLHA A SUA BEBIDA\n*Digite a opção que deseja:*\n\n' + items_size + '\n\n⚠️ ```APENAS UMA OPÇÃO POR VEZ``` ⚠️\n*——————————*\n#️⃣ *→* ```FINALIZAR Pedido```\n*️⃣ *→* ```REFAZER Pedido```';
      }
      */

      // Define a etapa atual do usuário como 6 no objeto "storage" com a chave "from"
      storage[from_client].stage = 6;
      // Armazena o endereço do usuário no objeto "storage" com a chave "from"
      storage[from_client].address = message;
      // Obtendo o endereço do cliente a partir do objeto de armazenamento
      const address = message;
      let delivery_hours = 'A CONFIRMAR';
      let delivery_fee = false;
      let { totalMoney, pizzas } = await payAmountAndSummaryItems();

      try {
        const loja_id = storage[from_client].obj_store.id;
        //const bairro = await findbairroDB.exec({ searchTerm: address, loja_id: loja_id });
        const bairro = await findBySearchTerm({ router: 'bairro', search: address, id: loja_id });
        if (Array.isArray(bairro.rows) && bairro.rows.length === 1 && bairro.rows[0]) {
          delivery_hours = bairro.rows[0].delivery_hours + ' minutos';
          delivery_fee = parseInt(bairro.rows[0].price, 10);
        }
      } catch (error) {
        logger.error('ERRO AO BUSCAR BAIRRO: ' + error);
      }
      if (delivery_fee) {
        totalMoney = totalMoney + delivery_fee; // int
        storage[from_client].valor_total = totalMoney; // Novo valor total
        delivery_fee = `~---R$-${delivery_fee},00---~`; // string
        storage[from_client].taxa_entrega = delivery_fee;
        totalMoney = `R$ ${totalMoney},00`;

      } else {
        delivery_fee = '*A CONFIRMAR.*';
        storage[from_client].taxa_entrega = null;
        totalMoney = `R$ ${totalMoney},00 + ENTREGA`;
      }

      // Envia uma mensagem ao usuário com um resumo do Pedidoss
      const order = '✍```-Itens```: ' + `*${pizzas}*\n` +
        '📍```-Endereço```: ' + `*${address}.*\n` +
        '🏍```-Entrega```: ' + `${delivery_fee}\n` +
        '💰```-Total```: ' + `*${totalMoney}.*\n` +
        `⏳-Tempo de entrega: *${delivery_hours}*.\n\n`;

      let msgResponse = `${order}` +
        '*–>🛑 –FORMA DE PAGAMENTO:*\n' +
        '*——————————*\n' +
        '1️⃣ *–> Pix*\n' +
        '2️⃣ *→* ```Dinheiro```\n' +
        '3️⃣ *→* ```Cartão```';


      /**
       *         '*️⃣ *→* ```REFAZER Pedido```';
       */

      // ARMAZENANDO PARA CASO O CLIENTE NÃO RESPONDA, ENVIA PARA ATENDENTE
      storage[from_client].order = order + '\n\n*OBS:::O cliente não finalizou o pedido*';
      ///await client.sendText(from_client, msgResponse);
      return msgResponse;


      async function payAmountAndSummaryItems() {
        let totalMoney = 0;
        let pizzas = '';
        const items = storage[from_client].items

        items.map((item, index) => {
          // Verifica se é o último item da lista para decidir se deve colocar uma vírgula ou um ponto final
          if (index == items.length - 1) {
            totalMoney = totalMoney + parseInt(item.price, 10);
            pizzas += '(' + item.description + ').';
          } else {
            totalMoney = totalMoney + parseInt(item.price, 10);
            pizzas += '(' + item.description + '), ';
          }
        });
        storage[from_client].valor_total = totalMoney;
        storage[from_client].items = pizzas;
        return { totalMoney, pizzas };
      }


    } catch (error) { // envia e armazena no stage error
      logger.error('*Error stage 5::::*\n' + error.message + `\nClient Number: *${from.replace('@c.us', '')}*`);
      logger.error('557181768164@c.us', '*Error stage 5::::*\n' + error.message + `\nClient Number: *${from.replace('@c.us', '')}*`);
      storage[from].attendant = true;
      return;
    }
  },
};