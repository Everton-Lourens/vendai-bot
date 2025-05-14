import { inject, injectable } from 'tsyringe'
import { IMessagesRepository } from '../../../repositories/Messages/IMessagesRepository'
import { MessageInSale } from '../../../entities/sale'

interface IRequest {
  messages: MessageInSale[]
}

@injectable()
export class UpdateMessagesStock {
  messagesRepository: IMessagesRepository
  constructor(
    @inject('MessagesRepository') messagesRepository: IMessagesRepository,
  ) {
    this.messagesRepository = messagesRepository
  }

  async execute({ messages }: IRequest): Promise<void> {
    for (const message of messages) {
      const filters = {
        _id: message._id,
      }

      const updateFields = {
        $inc: {
          stock: -Number(message.amount),
        },
      }

      await this.messagesRepository.update({ filters, updateFields })
    }
  }
}
