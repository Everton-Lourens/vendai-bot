/*
Nesse código, seis objetos de etapa são importados de seus respectivos arquivos JS.
Em seguida, todos os objetos de etapa são exportados como propriedades do módulo usando
a sintaxe de exportação de objeto. Isso permite que outros módulos importem esses objetos
de etapa individualmente usando a sintaxe de importação padrão, por exemplo:

javascript
Copy code
const { stageOne } = require( './etapas.js';
Com isso, o objeto de etapa 'stageOne' pode ser usado no arquivo que importou a partir do
arquivo 'etapas.js'.
*/
const { initialStage } = require('./0.js');
const { stageOne } = require('./1.js');
const { stageTwo } = require('./2.js');
const { stageThree } = require('./3.js');
const { stageFour } = require('./4.js');
const { stageAddress } = require('./5.js');
const { paymentStage } = require('./6.js');
const { finalStage } = require('./7.js');

// Exporta cada objeto de etapa como uma propriedade do módulo
module.exports = {
  initialStage,
  stageOne,
  stageTwo,
  stageThree,
  stageFour,
  stageAddress,
  paymentStage,
  finalStage
};