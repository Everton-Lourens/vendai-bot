import express from 'express'
import { MessageController } from '../controllers/MessageController'
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated'

const messagesRoutes = express.Router()
const messageController = new MessageController()

// Middlewares
messagesRoutes.use(ensureAuthenticated)

// Routes
messagesRoutes.get('/', messageController.listMessages.bind(messageController))
messagesRoutes.get('/padroes', messageController.getDefaultMessages.bind(messageController))
messagesRoutes.post('/', messageController.createNewMessage.bind(messageController))
messagesRoutes.put('/', messageController.updateMessage.bind(messageController))
messagesRoutes.delete('/', messageController.deleteMessage.bind(messageController))

export { messagesRoutes }