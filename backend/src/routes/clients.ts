import { Router } from 'express'
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated'
import { ClientController } from '../controllers/ClientController'

const clientsRoutes = Router()
const clientController = new ClientController()

// Middlewares
clientsRoutes.use(ensureAuthenticated)

// Routes
clientsRoutes.post('/', clientController.create.bind(clientController))
clientsRoutes.get('/', clientController.list.bind(clientController))
clientsRoutes.put('/:clientId', clientController.update.bind(clientController))
clientsRoutes.delete('/:clientId', clientController.delete.bind(clientController))

export { clientsRoutes }

