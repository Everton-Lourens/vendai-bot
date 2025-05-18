import express from 'express'
import { ProductController } from '../controllers/ProductController'
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated'

const chatRoutes = express.Router()
const productController = new ProductController()

// Middlewares
chatRoutes.use(ensureAuthenticated)

// Routes
chatRoutes.get('/', productController.listProducts.bind(productController))
chatRoutes.get('/padroes', productController.getDefaultProducts.bind(productController))
chatRoutes.post('/', productController.createNewProduct.bind(productController))
chatRoutes.put('/', productController.updateProduct.bind(productController))
chatRoutes.delete('/', productController.deleteProduct.bind(productController))

export { chatRoutes }

