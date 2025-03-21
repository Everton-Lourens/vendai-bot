const { storage } = require('../storage.js');
const { msgStage } = require('./msgResponse.js');
// @@@@@@@@@@@@@@@@@@@@@@ const { updateOrGetCustomers } = require('../my_db/repositories/my_sqlite3.js');

module.exports.finalStage = {
  async exec({ from, clientProvius }) {
    let from_client = '';
    let from_group = '';

    if (from.length == 17 || from.length == 18) {
      from_client = from;
      from_group = storage[from_client].grupo;
    } else {
      from_group = from;
      from_client = storage[from_group].client;
    }

    //await finishService();

    const { message_2 } = msgStage[8];
    return message_2;

    async function finishService() {
      return new Promise(async (resolve, reject) => {

        const loja_id = storage[from_client].obj_store.id;
        await updateOrGetCustomers({
          from_group: from_group,
          from_client: from_client,
          loja_id: loja_id
        });

        if (from_client) {
          ////await client.simulateTyping(from_client, true);

          const msgResponseAttendant =
            `📞 *CLIENTE*: +${from_client.replace('@c.us', '')}\n` +
            '✅ *ATENDIMENTO ENCERRADO* ✅\n\n' +
            stage8_msg1;
          /////////////////////////////////////////////
          ////await client.sendText(from_group, msgResponseAttendant);

          const msgResponseClient = stage8_msg2;

          setTimeout(async () => {
            ////await client.sendText(from_client, msgResponseClient);
          }, 4000);

          setTimeout(async () => {
            ////await client.simulateTyping(from_client, false);
          }, 1500);

        } else {
          ////await client.simulateTyping(from_client, true);

          const msgResponseAttendant =
            `📞 *CLIENTE*: +${from_client.replace('@c.us', '')}\n` +
            '✅ *ATENDIMENTO ENCERRADO* ✅\n\n' +
            stage8_msg1;
          ////await client.sendText(from_group, msgResponseAttendant);

          const msgResponseClient = stage8_msg2;
          setTimeout(async () => {
            ////await client.sendText(from_client, msgResponseClient);
          }, 7000);

          setTimeout(async () => {
            ////await client.simulateTyping(from_client, false);
          }, 1500);
        }

        resolve();
      });
    }

  },
};