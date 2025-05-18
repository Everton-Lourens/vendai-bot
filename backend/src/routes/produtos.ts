import express from 'express'
import { ProductController } from '../controllers/ProductController'
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated'

const produtosRoutes = express.Router()
const productController = new ProductController()

// Middlewares
produtosRoutes.use(ensureAuthenticated)

// Routes
produtosRoutes.get('/', productController.listProducts.bind(productController))
produtosRoutes.get('/padroes', productController.getDefaultProducts.bind(productController))
produtosRoutes.post('/', productController.createNewProduct.bind(productController))
produtosRoutes.put('/', productController.updateProduct.bind(productController))
produtosRoutes.delete('/', productController.deleteProduct.bind(productController))

export { produtosRoutes }

