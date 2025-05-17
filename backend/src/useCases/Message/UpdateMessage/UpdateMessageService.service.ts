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
  messagesRepository: IMessagesRepository
  constructor(
    @inject('MessagesRepository') messagesRepository: IMessagesRepository,
  ) {
    this.messagesRepository = messagesRepository
  }

  async execute({
    idMessage,
    text,
    stage,
    position,
    isDefault,
  }: IRequest): Promise<void> {
    if (!idMessage) throw new AppError('_id da mensagem não informado')

    const messageNotFound = await this.messagesRepository.findById(idMessage)

    if (!messageNotFound) throw new AppError('Mensagem inválida')

    const filters = {
      _id: idMessage,
    }

    const updateFields = {
      text,
      stage,
      position,
      isDefault,
    }

    const updatedMessage = await this.messagesRepository.update({
      filters,
      updateFields,
    })

    return updatedMessage
  }
}
