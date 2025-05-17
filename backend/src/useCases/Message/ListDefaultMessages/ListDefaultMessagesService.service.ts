import { inject, injectable } from 'tsyringe'
import { IMessagesRepository } from '../../../repositories/Messages/IMessagesRepository'
import { Message } from '../../../entities/message'

interface IRequest {
  userId: string
}

@injectable()
export class ListDefaultMessageService {
  messagesRepository: IMessagesRepository
  constructor(
    @inject('MessagesRepository') messagesRepository: IMessagesRepository,
  ) {
    this.messagesRepository = messagesRepository
  }

  async execute({ userId }: IRequest): Promise<Message[]> {
    const messages = await this.messagesRepository.list({
      userId,
      searchString: null,
      onlyDefault: true,
    })

    return messages
  }
}
