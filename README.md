﻿ChatBot API para Autoatendimento:
Backend flexível para integração com qualquer plataforma.

# ChatBot API

# Tópicos do README
- *Tecnologias Utilizadas*
- *Visão Geral*
- *Explicação Detalhada do Back-End*
- *Estrutura de pastas do Back-End*
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

**Docker (nginx)**: `POST - http://localhost:9999/v1/chat`

**Localmente**: `POST - http://localhost:9999/v1/chat`

## Estrutura de Pastas do Back-End

```
RAIZ/
│-- nginx.conf
│-- docker-compose.yaml
│-- backend/
│   │-- Dockerfile.backend
│   │-- package.json
│   │-- tsconfig.json
│   │-- src/
│   │   │-- server.ts
│   │   │-- helpers/
│   │   │-- middleware/
│   │   │-- api/
│   │   │   │-- chatbot/
│   │   │   │   │-- response.ts
│   │   │   │   │-- stages.ts
│   │   │   │   │-- storage.ts
│   │   │   │   │-- stages/
│   │   │   │   │   │-- 0.ts
│   │   │   │   │   │-- 1.ts
│   │   │   │   │   │-- 2.ts
│   │   │   │   │   │-- 3.ts
│   │   │   │   │   │-- index.ts
```

## Como utilizar com Docker

```bash
git clone https://github.com/Everton-Lourens/chatbot-api.git
cd chatbot-api
docker-compose up --build
```

## Como utilizar Localmente
- **Descrição**: Instale as dependências "`npm run setup`" e utilize "`npm run start`" para iniciar o Front-End *(localhost:3000)* e o Back-End *(localhost:9999)* ao mesmo tempo com a lib de desenvolvimento "`concurrently`".

```bash
git clone https://github.com/Everton-Lourens/chatbot-api.git
cd chatbot-api
npm run setup
npm run start
```

#### Fluxo de uso:

- **Primeira Requisição**:
   Envie no corpo da requisição o objeto inicial com as informações do cliente, como no exemplo abaixo:

#### Obsevação: Como este é apenas um teste, você deve utilizar o seguinte JSON no corpo da requisição POST para garantir o funcionamento correto:

   ```json
   {
     "client": {
       "id": "999",
       "stage": 0,
       "message": "Olá"
     }
   }
  ```

#### Exemplo padrão de Requisição para testar o Back-End localmente:

`POST - http://localhost:9999/v1/chat`

   ```json
curl -X POST "http://localhost:9999/v1/chat" -H "Content-Type: application/json" -d "{\"client\":{\"id\":\"999\",\"stage\":0,\"message\":\"Olá\"}}"
  ```

#### Resposta da Requisição:
   ```json
{
    "messageAlert": "Operação realizada com sucesso",
    "data": [
        {
            "status": 200,
            "message": "Operação realizada com sucesso",
            "timestamp": "2025-03-26T17:24:01.058Z",
            "client": {
                "id": "fb87893a-6603-4b90-b693-de31a3355991",
                "stage": 1,
                "message": "Olá",
                "response": "👋 Bem-vindo(a)\nSou a Megan, Assistente Virtual.\nPosso te ajudar? 🙋‍♀ 🥰\n\n——————————\n1️⃣ –> FAZER PEDIDO\n2️⃣ → TAXA de Entrega\n3️⃣ → FALAR C/ Atendente",
                "order": {
                    "stage": 1,
                    "wantsHumanService": false,
                    "items": [],
                    "address": null,
                    "trackRecordResponse": [
                        {
                            "id": "fb87893a-6603-4b90-b693-de31a3355991",
                            "currentStage": 0,
                            "nextStage": 1,
                            "message": "Olá",
                            "response": "👋 Bem-vindo(a)\nSou a Megan, Assistente Virtual.\nPosso te ajudar? 🙋‍♀ 🥰\n\n——————————\n1️⃣ –> FAZER PEDIDO\n2️⃣ → TAXA de Entrega\n3️⃣ → FALAR C/ Atendente"
                        }
                    ]
                }
            },
            "error_code": ""
        }
    ]
}
  ```

  #### Agora reenvie o objeto `{ client }` a cada requisição, alterando apenas o `"message:"` dentro do objeto `{ client }` para se comunicar com o ChatBot.

  ```json
  "client": {
                "id": "fb87893a-6603-4b90-b693-de31a3355991",
                "stage": 1,
                "message": "1", // ALTERE SUA RESPOSTA AQUI
                "response": "👋 Bem-vindo(a)\nSou a Megan, Assistente Virtual.\nPosso te ajudar? 🙋‍♀ 🥰\n\n——————————\n1️⃣ –> FAZER PEDIDO\n2️⃣ → TAXA de Entrega\n3️⃣ → FALAR C/ Atendente",
                "order": {
                    "stage": 1,
                    "wantsHumanService": false,
                    "items": [],
                    "address": null,
                    "trackRecordResponse": [
                        {
                            "id": "fb87893a-6603-4b90-b693-de31a3355991",
                            "currentStage": 0,
                            "nextStage": 1,
                            "message": "Olá",
                            "response": "👋 Bem-vindo(a)\nSou a Megan, Assistente Virtual.\nPosso te ajudar? 🙋‍♀ 🥰\n\n——————————\n1️⃣ –> FAZER PEDIDO\n2️⃣ → TAXA de Entrega\n3️⃣ → FALAR C/ Atendente"
                        }
                    ]
                }
            },
  ```
