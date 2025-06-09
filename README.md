﻿O Chatbot no Backend é flexível para integração com qualquer plataforma (Whatsapp, Telegram etc).

# Vendaí Bot

🚧 **Em construção** 🚧  
Este projeto está sendo ativamente desenvolvido. Algumas funcionalidades podem mudar ou ainda não estar disponíveis.

# Tópicos do README
- *Tecnologias Utilizadas*
- *Visão Geral*
- *Explicação Detalhada do Back-End*
- *Como utilizar com Docker*
- *Como utilizar Localmente*

## Tecnologias Utilizadas
- **Node.js v20.16.0**
- **TypeScript**
- **Balanceador de carga: ngnix & cluster**
- **Docker**
- **Express.js**
- **React**
- **Next.js**

## Visão Geral
- **Descrição do Projeto**: Esta API oferece um chatbot de autoatendimento para qualquer plataforma de mensagens (Whatsapp, Telegram etc), permitindo que os clientes interajam e façam pedidos, consultem o cardápio, verifiquem a taxa de entrega ou solicitem atendimento humano, podendo se extender para outras funcionalidades futuras.

## Explicação Detalhada do Back-End

### **Balanceador de Carga**:
O Back-End utiliza o **Nginx** e o **cluster** como balanceador de carga para distribuir as requisições entre *duas (ou mais) instâncias do servidor*.

### **Cluster**:
Cada instância (duas nesse caso) opera com um **cluster de 5 workers**, totalizando *10 processos ativos*, **evitando sobrecarga no servidor** caso tenha uma alta demanda de requisições, podendo aumentar ou diminuir os workers conforme demanda.

### **Fluxo de Requisições no Nginx e no Cluster**:  
- O processo principal (master) cria múltiplos workers (processos filhos).
- Cada worker escuta as mesmas conexões, como se fosse uma cópia do servidor.
- O balanceador de carga Nginx recebe a requisição do cliente e decide para qual instância do servidor vai enviar.
- A instância repassa a requisição para um worker disponível no cluster (neste caso, 10 workers/processos).
- O sistema operacional distribui as requisições entre os workers de forma balanceada.
- Se um worker falhar, o processo principal cria um novo automaticamente.

### **É possível adicionar, mas não foi utilizado**:
Toda pagina estática pode ser armazenada em cache (Redis ou Memcached) para melhorar o desempenho e reduzir ainda mais o custo da requisição.
*Obs:: Nginx também pode armazenar a página em cache.*

### Endpoint Front-End
`GET - http://localhost:3000`

### Endpoint Back-End
**Docker (nginx)**: `POST - http://localhost:9999/chat/chatbot`

**Localmente**: `POST - http://localhost:9999/chat/chatbot`

## Como utilizar Localmente
- **Descrição**: Instale as dependências "`npm run setup`" e utilize "`npm run start`" para iniciar o Front-End *(localhost:3000)* e o Back-End *(localhost:9999)* ao mesmo tempo com a lib de desenvolvimento "`concurrently`".

```bash
git clone https://github.com/Everton-Lourens/vendai-bot.git
cd vendai-bot
#npm run setup
#npm run start
```

## Como utilizar com Docker (INDISPONÍVEL NO MOMENTO)

```bash
#git clone https://github.com/Everton-Lourens/vendai-bot.git
#cd vendai-bot
#docker-compose up --build
```