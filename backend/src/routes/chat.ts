import express from 'express'
import { MessageController } from '../controllers/MessageController'
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated'
import { validationFilter } from '../middlewares/validate'

const chatRoutes = express.Router()
const chatbotController = new MessageController()

// Middlewares
chatRoutes.use(ensureAuthenticated)

// Routes
chatRoutes.get('/', chatbotController.sendMessageToChatbot.bind(chatbotController))
chatRoutes.post('/chatbot', validationFilter, chatbotController.sendMessageToChatbot.bind(chatbotController))
chatRoutes.get('/chatbot', chatbotController.sendMessageToChatbot.bind(chatbotController))
chatRoutes.get('/padroes', chatbotController.getDefaultMessages.bind(chatbotController))
chatRoutes.put('/', chatbotController.updateMessage.bind(chatbotController))
chatRoutes.delete('/', chatbotController.deleteMessage.bind(chatbotController))

export { chatRoutes }

