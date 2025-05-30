import express from 'express'
import { MessageController } from '../controllers/MessageController'
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated'
import { validationFilter } from '../middlewares/validate'

const chatbotRoutes = express.Router()
const chatbotController = new MessageController()

// Middlewares
//chatbotRoutes.use(ensureAuthenticated)

// Routes
chatbotRoutes.get('/', chatbotController.sendMessageToChatbot.bind(chatbotController))
chatbotRoutes.post('/chat', validationFilter, chatbotController.sendMessageToChatbot.bind(chatbotController))
chatbotRoutes.get('/chat', chatbotController.sendMessageToChatbot.bind(chatbotController))
chatbotRoutes.get('/padroes', chatbotController.getDefaultMessages.bind(chatbotController))
chatbotRoutes.put('/', chatbotController.updateMessage.bind(chatbotController))
chatbotRoutes.delete('/', chatbotController.deleteMessage.bind(chatbotController))

export { chatbotRoutes }

