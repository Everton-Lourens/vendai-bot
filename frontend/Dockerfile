# Usa Node.js 20 como base
FROM node:20-alpine

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos package.json e package-lock.json primeiro
COPY package*.json ./

# Instala as dependências
RUN npm ci --production

# Copia o restante dos arquivos
COPY . .

# Compila o frontend (caso use React/Vue/Angular)
RUN npm run build

# Expõe a porta 3000
EXPOSE 3000

# Comando para iniciar o frontend
CMD ["npm", "start"]
