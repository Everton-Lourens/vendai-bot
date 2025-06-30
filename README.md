﻿O Chatbot no Backend é flexível para integração com qualquer plataforma (Whatsapp, Telegram etc).

# Vendaí Bot

- **Descrição do Projeto**: O Vendaí Bot é um sistema de vendas com painel completo e chatbot integrado. Por meio do chatbot, o cliente pode fazer pedidos, consultar o cardápio, ver a taxa de entrega ou falar com um atendente. Os pedidos realizados são enviados automaticamente para a API, que registra a compra e a exibe na aba de vendas do sistema em tempo real.

🚧 **Em construção** 🚧  
Este projeto está sendo ativamente desenvolvido. Algumas funcionalidades podem mudar ou ainda não estar disponíveis.

# Tópicos do README
- *Tecnologias Utilizadas*
- *Visão Geral*
- *Funcionalidades*
- *Como utilizar Localmente*
- *Como utilizar com Docker (indisponível)*
- *Explicação Detalhada do Back-End*

## Tecnologias Utilizadas
- **Node.js v20.16.0**
- **TypeScript**
- **MongoDB**
- **Balanceador de carga: ngnix & cluster**
- **Docker**
- **Express.js**
- **React**
- **Next.js**

## Visão Geral

## ⚙️ Funcionalidades

### 🖥️ Painel Administrativo
- Dashboard com resumo de vendas (aprovadas, canceladas, total e quantidade).
- Gráficos de produtos mais vendidos.
- Filtros por período (data inicial/final).
- Visualização de contas de entrada e saída.
- Seções dedicadas para clientes, produtos, vendas, mensagens e fornecedores.

### 💬 Chatbot de Autoatendimento
- Interface simples e direta para o cliente realizar pedidos.
- Exibe lista dos produtos cadastrados e o preço.
- Permite consultar taxa de entrega e falar com atendente humano.
- Ao finalizar o pedido, os dados são enviados para a API e registrados automaticamente na aba de **Vendas**.

## Como utilizar Localmente
- **Descrição**: Instale as dependências "`npm run setup`" e utilize "`npm run start`" para iniciar o Front-End *(localhost:3000)* e o Back-End *(localhost:9999)* ao mesmo tempo com a lib de desenvolvimento "`concurrently`".

```bash
git clone https://github.com/Everton-Lourens/vendai-bot.git
cd vendai-bot
npm run setup
npm run start
```

## Como utilizar com Docker (INDISPONÍVEL NO MOMENTO)

```bash
#git clone https://github.com/Everton-Lourens/vendai-bot.git
#cd vendai-bot
#docker-compose up --build
```

## Explicação Detalhada do Back-End

### **Balanceador de Carga (apenas com docker)**:
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
**Docker**: `POST - http://localhost:9999/chat/chatbot`

**Localmente**: `POST - http://localhost:9999/chat/chatbot`
