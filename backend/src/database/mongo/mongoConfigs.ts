import mongoose from 'mongoose'

const MONGO_USERNAME = 'lourens'
const MONGO_PASSWORD = 'u72E1K8bxPcVgFhM'
const mongoURL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@clusterreactnative0.ct2fmit.mongodb.net/?retryWrites=true&w=majority`
// //mongodb+srv://lourens:YIJjK4Ztbgh7zSUN@cluster0.9fvjdnu.mongodb.net/?retryWrites=true&w=majority
mongoose.connect(mongoURL)
mongoose.connection
  .on(
    'error',
    console.error.bind(console, 'Erro ao conectar com o banco de dados'),
  )
  .once('open', () => {
    console.log('Conexão com o banco de dados (mongo) estabelecida com sucesso')
  })

export default mongoose
