import express from 'express'
import { MessageController } from '../controllers/MessageController'
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated'

const messagesRoutes = express.Router()
const messageController = new MessageController()

// Middlewares
messagesRoutes.use(ensureAuthenticated)

// Routes
messagesRoutes.get('/', messageController.listMessages)
messagesRoutes.get('/padroes', messageController.getDefaultMessages)
messagesRoutes.post('/', messageController.createNewMessage)
messagesRoutes.put('/', messageController.updateMessage)
messagesRoutes.delete('/', messageController.deleteMessage)

export { messagesRoutes }
