import { ChatbotSaleController } from './index'
import { Sale } from '../../entities/sale'
import { INewSaleDTO } from '../../repositories/Sales/ISalesRepository'
import { AppError } from '../../errors/AppError'

export class CartChatbot {
    private data: INewSaleDTO;

    constructor(data: INewSaleDTO) {
        this.data = data;
    }

    private validate() {
        const requiredFields = [
            "clientId",
            "products",
            "totalValue",
            "paymentType",
            "userId",
        ];
        const missingFields = requiredFields.filter(field => !String(this.data[field]));
        if (missingFields.length > 0)
            throw new AppError(`Missing fields: ${missingFields.join(", ")}`, 400)
    }

    public async checkout(): Promise<Sale> {
        this.validate();
        const controller = new ChatbotSaleController()
        if (!controller) throw new AppError('ChatbotSaleController not found', 500)
        return await controller.create(this.data)
    }
}
