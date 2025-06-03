import express from 'express'
import { ChatbotController } from '../controllers/ChatbotController'
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated'
import { validationFilter } from '../middlewares/validate'

const chatRoutes = express.Router()
const chatbotController = new ChatbotController()

// Middlewares
chatRoutes.use(ensureAuthenticated)

// Routes
chatRoutes.get('/', chatbotController.sendMessageToChatbot.bind(chatbotController))
chatRoutes.post('/chatbot', validationFilter, chatbotController.sendMessageToChatbot.bind(chatbotController))
chatRoutes.get('/chatbot', chatbotController.sendMessageToChatbot.bind(chatbotController))

export { chatRoutes }

