import { inject, injectable } from 'tsyringe'
import { IMessagesRepository } from '../../../repositories/Messages/IMessagesRepository'
import { AppError } from '../../../errors/AppError'

@injectable()
export class DeleteMessageService {
  messagesRepository: IMessagesRepository
  constructor(
    @inject('MessagesRepository') messagesRepository: IMessagesRepository,
  ) {
    this.messagesRepository = messagesRepository
  }

  async execute(idMessage: string): Promise<void> {
    if (!idMessage) throw new AppError('_id da mensagem não informado')

    const messageNotFound = await this.messagesRepository.findById(idMessage)

    if (!messageNotFound) throw new AppError('Mensagem não encontrada')

    await this.messagesRepository.delete(idMessage)
  }
}
