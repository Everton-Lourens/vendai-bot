import { container } from 'tsyringe'
import { CreateNewSaleService } from '../../useCases/Sale/CreateNewSale/CreateNewSale.service'
import { UpdateProductsStock } from '../../useCases/Product/UpdateProductStock/UpdateProductsStock.service'
import { INewSaleDTO } from '../../repositories/Sales/ISalesRepository'
import { Sale } from '../../entities/sale'
import { AppError } from '../../errors/AppError'

export class ChatbotSaleController {
    async create(data: INewSaleDTO): Promise<Sale> {
        try {
            const { userId, clientId, products, paymentType, totalValue = 0 } = data

            const createNewSaleService = container.resolve(CreateNewSaleService)
            const newSale = await createNewSaleService.execute({
                clientId,
                products,
                paymentType,
                totalValue,
                userId,
            })

            const updateProductsStock = container.resolve(UpdateProductsStock)
            await updateProductsStock.execute({ products })

            return newSale
        } catch (error) {
            throw new AppError(error.message, 500)
        }
    }
}

