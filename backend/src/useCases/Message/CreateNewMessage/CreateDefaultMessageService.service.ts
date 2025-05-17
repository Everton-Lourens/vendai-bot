import { inject, injectable } from 'tsyringe'
import { IMessagesRepository } from '../../../repositories/Messages/IMessagesRepository'
import { Message } from '../../../entities/message'
import { AppError } from '../../../errors/AppError'

interface IRequest {
  userId: string
}

@injectable()
export class CreateDefaultMessageService {
  messagesRepository: IMessagesRepository
  constructor(
    @inject('MessagesRepository') messagesRepository: IMessagesRepository,
  ) {
    this.messagesRepository = messagesRepository
  }

  async execute({
    userId,
  }: IRequest): Promise<Message[]> {

    if (!userId)
      throw new AppError('Nenhum usuário foi informado')

    const defaultMessages = this.messagesRepository.createDefault({
      userId,
    })

    return defaultMessages
  }
}
