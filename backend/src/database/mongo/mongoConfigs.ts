import mongoose from 'mongoose'

const MONGO_USERNAME = 'lourens';
const MONGO_PASSWORD = 'u72E1K8bxPcVgFhM';
const mongoURL =  process.env.DB_URL || `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.5klkiuy.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connect(mongoURL, {
  maxPoolSize: Number(process.env.DB_POOL) || 100,
  serverSelectionTimeoutMS: 10000,
});

mongoose.connection
  .on('error', console.error.bind(console, 'Erro ao conectar com o banco de dados'))
  .once('open', () => {
    console.log('Conexão com o banco de dados (mongo) estabelecida com sucesso');
  });

export default mongoose
