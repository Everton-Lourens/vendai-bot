import express from 'express'
import { AccountController } from '../controllers/AccountController'
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated'

const contasRoutes = express.Router()
const accountController = new AccountController()

// Middlewares
contasRoutes.use(ensureAuthenticated)

// Routes
contasRoutes.get('/', accountController.listAccounts.bind(accountController))
contasRoutes.post('/', accountController.createNewAccount.bind(accountController))
contasRoutes.put('/', accountController.updateAccount.bind(accountController))
contasRoutes.patch(
  '/updateStatus/:idAccount',
  accountController.updateStatusAccount.bind(accountController),
)
contasRoutes.delete('/', accountController.deleteAccount.bind(accountController))

export { contasRoutes }

