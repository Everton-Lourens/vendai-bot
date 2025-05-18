import express from 'express'
import { SaleController } from '../controllers/SaleController'
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated'

const vendasRoutes = express.Router()
const saleController = new SaleController()

// Midlewares
vendasRoutes.use(ensureAuthenticated)

// Routes
vendasRoutes.get('/', saleController.listSales.bind(saleController))
vendasRoutes.post('/', saleController.createNewSale.bind(saleController))
vendasRoutes.put('/', saleController.updateSale.bind(saleController))
vendasRoutes.put('/cancelar', saleController.cancelSale.bind(saleController))

export { vendasRoutes }

