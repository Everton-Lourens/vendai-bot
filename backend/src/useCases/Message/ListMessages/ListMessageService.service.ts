import { inject, injectable } from 'tsyringe'
import { IMessagesRepository } from '../../../repositories/Messages/IMessagesRepository'
import { Message } from '../../../entities/message'

interface IRequest {
  userId: string
  searchString: string
}

@injectable()
export class ListMessageService {
  messagesRepository: IMessagesRepository
  constructor(
    @inject('MessagesRepository') messagesRepository: IMessagesRepository,
  ) {
    this.messagesRepository = messagesRepository
  }

  async execute({ userId, searchString }: IRequest): Promise<Message[]> {
    const messages = await this.messagesRepository.list({
      userId,
      searchString,
      onlyDefault: false,
    })

    return messages
  }
}
