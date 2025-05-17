import { inject, injectable } from 'tsyringe'
import { IMessagesRepository } from '../../../repositories/Messages/IMessagesRepository'
import { AppError } from '../../../errors/AppError'

interface IRequest {
  idMessage: string
  text: string
  stage: number
  position: number
  isDefault: boolean
}

@injectable()
export class UpdateNewMessageService {
  productsRepository: IMessagesRepository
  constructor(
    @inject('MessagesRepository') productsRepository: IMessagesRepository,
  ) {
    this.productsRepository = productsRepository
  }

  async execute({
    idMessage,
    text,
    stage,
    position,
    isDefault,
  }: IRequest): Promise<void> {
    if (!idMessage) throw new AppError('_id da mensagem não informado')

    const productNotFound = await this.productsRepository.findById(idMessage)

    if (!productNotFound) throw new AppError('Mensagem inválida')

    const filters = {
      _id: idMessage,
    }

    const updateFields = {
      text,
      stage,
      position,
      isDefault,
    }

    const updatedMessage = await this.productsRepository.update({
      filters,
      updateFields,
    })

    return updatedMessage
  }
}
