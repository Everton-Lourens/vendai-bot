import express from 'express'
import { TokenController } from '../controllers/TokenController'
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated'

const tokenRoutes = express.Router()
const tokenController = new TokenController()

// Midlewares
tokenRoutes.use(ensureAuthenticated)

// Routes
tokenRoutes.get('/', tokenController.checkToken.bind(tokenController))

export { tokenRoutes }

