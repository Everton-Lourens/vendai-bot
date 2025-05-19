import express from 'express'
import { MessageController } from '../controllers/MessageController'
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated'
import { validationFilter } from '../middlewares/middleware'

const mensagemRoutes = express.Router()
const messageController = new MessageController()

// Middlewares
mensagemRoutes.use(ensureAuthenticated)

// Routes
mensagemRoutes.get('/', messageController.listMessages.bind(messageController))
mensagemRoutes.post('/chat', validationFilter, messageController.sendMessageToChatbot.bind(messageController))
mensagemRoutes.get('/chat', messageController.sendMessageToChatbot.bind(messageController))
mensagemRoutes.get('/padroes', messageController.getDefaultMessages.bind(messageController))
mensagemRoutes.post('/', messageController.createNewMessage.bind(messageController))
mensagemRoutes.put('/', messageController.updateMessage.bind(messageController))
mensagemRoutes.delete('/', messageController.deleteMessage.bind(messageController))

export { mensagemRoutes }

