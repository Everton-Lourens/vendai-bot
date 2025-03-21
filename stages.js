// Importando as etapas do processo de atendimento
const {
  initialStage,
  stageOne,
  stageTwo,
  stageThree,
  stageFour,
  stageAddress,
  paymentStage,
  finalStage
} = require('./stages/index.js');

// Importando o objeto de armazenamento das informações do usuário
const { storage } = require('./storage.js');
const { getInCache } = require('../database/cache.js');

// Array de objetos que descrevem cada etapa do processo de atendimento
module.exports.stages = [
  {
    descricao: 'Welcome',
    stage: initialStage,
  },
  {
    descricao: 'Store',
    stage: stageOne,
  },
  {
    descricao: 'Size',
    stage: stageTwo,
  },
  {
    descricao: 'Flavors',
    stage: stageThree,
  },
  {
    descricao: 'Drink',
    stage: stageFour,
  },
  {
    descricao: 'Address',
    stage: stageAddress,
  },
  {
    descricao: 'Payment',
    stage: paymentStage,
  },
  {
    descricao: 'final',
    stage: finalStage,
  }
];

// Função que retorna a etapa atual do usuário com base no número de telefone
module.exports.getStage = async ({ from, franquia_id, restart }) => { // Recebe um objeto com uma propriedade from, que representa o número de telefone do remetente da mensagem.
  const getStorage = await getInCache(from);
  const USER_SESSION = JSON.parse(getStorage);

  if ((USER_SESSION?.stage || USER_SESSION?.stage === 0) && restart !== true) {
    storage[from] = USER_SESSION;
    return storage[from].stage;
  }

  const store = { // Cria um objeto para o cliente
    stage: 0,
    franquia_id: franquia_id,
    statusChatbot: true,
    attendant: false,
    timeoutID: null,
    chose_flavor: null,
    chose_drink: null,
    itens: [],
    listOfMenusize: [],
    listOfSabor: [],
    listOfBebida: [],
    address: null,
    errorChoose: null,
    obj_store: {},
    grupo: null,
    client: null,
    payment: null,
    order: null,
    flavorQuantity: null,
    menuCount: 0,
    taxa_entrega: null,
    valor_total: null,
  };

  storage[from] = store;

  return storage[from].stage; // retorna a etapa atual, que é a etapa inicial (0)
}