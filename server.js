const { logger } = require('../logger.js');

const { stages, getStage } = require('./stages.js');
const { storage } = require('./storage.js');
const { saveInCache } = require('../database/cache.js');
require('dotenv').config();
module.exports.meganStart = async (data) => {

   // ARRUMAR DEPOIS        @@@@@@@@@@@@@@@@@@@@@@
   //if (process.env.NODE_ENV === 'development' && process.env.FRANQUIA_ID) {
   //   const message = {};
   //   const from_client = '77777777777.@c.us';
   //   const franquia_id = process.env.FRANQUIA_ID;
   //   message.from = from_client;
   //   message.body = '1';
   //} else {
   const { message } = data;
   const { franquia_id } = message;
   const from_client = message.from;
   //}

   try {
      const response = await execStage();


      const data = {
         //message: message,  ???????
         response: response ? response : null, // SE COLOCAR "CHATBOT DESATIVADO!" NO RESPONSE VAI DESATIVAR QUEBRAR O BOT
         obj_store: storage[from_client].obj_store,
         attendant: storage[from_client].attendant,
         order: storage[from_client].order,
      };

      if (data?.response === 'CHATBOT DESATIVADO!')
         storage[from_client].attendant = true; // faz apagar o storage


      const deleteStorage = (storage[from_client].attendant);
      const finalStageTimeout = deleteStorage ? 1 : (process.env.TIMEOUT_REDIS || 180); // 180=3minutos || 300=5minutos

      await saveInCache({ key: from_client, value: JSON.stringify(storage[from_client]), expire: finalStageTimeout });
      //await STORAGE_REDIS.set(from_client, JSON.stringify(storage[from_client]));
      //await STORAGE_REDIS.expire(from_client, finalStageTimeout);

      delete storage[from_client];

      return data;


      async function execStage() {
         let restart = false;
         if (message.body === '*' || message.body === '*️⃣')
            restart = true;

         let currentStage = await getStage({ from: from_client, franquia_id, restart }); // getStage é responsável por retornar a etapa atual do processo para um determinado número de telefone. Se você usar um número de telefone diferente, ele irá retornar a etapa correspondente ao número de telefone fornecido.

         if (message.body.toUpperCase() == 'ATENDENTE') {// @@@ AQQQQQUIIII EU VOU ENCAMINHAR A MENSAGEM PARA O NUMERO DESEJADO @@@
            // envia para o stage 5 para falar com atendente
            storage[from_client].attendant = true;
            return;
         } else if (message.body.toUpperCase() == 'BUSCAR ÚLTIMOS CLIENTES') {
            storage[from_client].stage = 7;
            currentStage = 7;

         } else if (message.body.toUpperCase() == 'FINALIZAR ATENDIMENTO') {
            storage[from_client].attendant = true;
            storage[from_client].stage = 7;
            currentStage = 7;
         }

         return await stages[currentStage].stage.exec({
            self: message.self,
            from: from_client,
            message: message.body,
            client_name: message.name
         });

      }

   } catch (error) {
      if (storage[from_client]) {
         await saveInCache({ key: from_client, value: JSON.stringify(storage[from_client]), expire: 1 });
         delete storage[from_client];
      }
      logger.error('DEU PROBLEMA CATCH Ouvinte------------------------');
      logger.error(error);
      return { data: { message: data.message, error: error } };
   }
}

