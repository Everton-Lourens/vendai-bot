import mongoose from 'mongoose'
import { logger } from '../../helpers/logger';

const MONGO_USERNAME = 'lourens';
const MONGO_PASSWORD = 'u72E1K8bxPcVgFhM';
const MONGO_DEV_URL = 'mongodb://lourens:12345678@localhost:27017/?authSource=admin';
const mongoURL = process.env.DB_URL || `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.5klkiuy.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connect(mongoURL, {
  maxPoolSize: Number(process.env.DB_POOL) || 100,
  serverSelectionTimeoutMS: 10000,
})
  .catch(() => {
    logger.error('Erro ao conectar com o banco de dados (principal). Tentando conectar no desenvolvimento (localhost)...');
    mongoose.connect(MONGO_DEV_URL, {
      maxPoolSize: Number(process.env.DB_POOL) || 100,
      serverSelectionTimeoutMS: 10000,
    });
  })
  .then(() => {
    logger.info('Conexão com o banco de dados (mongo) estabelecida com sucesso');
  });

export default mongoose

