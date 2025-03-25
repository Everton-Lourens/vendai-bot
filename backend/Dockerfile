# Usa Node.js 20 como base
FROM node:20-alpine

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos package.json e package-lock.json primeiro (para cache eficiente)
COPY package*.json ./

# Instala as dependências
RUN npm ci --production

# Instala o TypeScript globalmente
RUN npm install -g typescript

# Copia o restante dos arquivos
COPY . .

# Compila os arquivos TypeScript para JavaScript
RUN tsc

# Expõe a porta 3005
EXPOSE 3005

# Comando para iniciar o backend (após compilar os arquivos TypeScript)
CMD ["node", "dist/server.js"]
