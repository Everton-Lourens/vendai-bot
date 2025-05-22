import { inject, injectable } from 'tsyringe'
import { IProductsRepository } from '../../../repositories/Products/IProductsRepository'
import { Product } from '../../../entities/product'

interface IRequest {
  userId: string
  searchString: string
  code?: string
}

interface IRequestByCode {
  userId: string
  code: string
}

@injectable()
export class ListProductsService {
  productsRepository: IProductsRepository
  constructor(
    @inject('ProductsRepository') productsRepository: IProductsRepository,
  ) {
    this.productsRepository = productsRepository
  }

  async execute({ userId, searchString }: IRequest): Promise<Product[]> {
    const products = await this.productsRepository.list({
      userId,
      searchString,
      onlyDefault: false,
    })
    return products
  }
  async executeByCode({ userId, code }: IRequestByCode): Promise<Product | null> {
    const product = await this.productsRepository.findByCode({
      userId,
      code,
    });

    return product;
  }
}
