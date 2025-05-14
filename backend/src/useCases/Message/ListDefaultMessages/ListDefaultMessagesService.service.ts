import { inject, injectable } from 'tsyringe'
import { IMessagesRepository } from '../../../repositories/Messages/IMessagesRepository'
import { Message } from '../../../entities/message'

interface IRequest {
  userId: string
}

@injectable()
export class ListDefaultMessageService {
  productsRepository: IMessagesRepository
  constructor(
    @inject('MessagesRepository') productsRepository: IMessagesRepository,
  ) {
    this.productsRepository = productsRepository
  }

  async execute({ userId }: IRequest): Promise<Message[]> {
    const products = await this.productsRepository.list({
      userId,
      searchString: null,
      onlyDefault: true,
    })

    return products
  }
}
