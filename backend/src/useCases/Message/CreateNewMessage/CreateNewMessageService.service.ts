import { inject, injectable } from 'tsyringe'
import { IMessagesRepository } from '../../../repositories/Messages/IMessagesRepository'
import { Message } from '../../../entities/message'
import { AppError } from '../../../errors/AppError'

interface IRequest {
  text: string
  stage: number
  isDefault: boolean
  userId: string
}

@injectable()
export class CreateNewMessageService {
  messagesRepository: IMessagesRepository
  constructor(
    @inject('MessagesRepository') messagesRepository: IMessagesRepository,
  ) {
    this.messagesRepository = messagesRepository
  }

  async execute({
    text,
    stage,
    isDefault,
    userId,
  }: IRequest): Promise<Message> {
    const alreadExistMessage = await this.messagesRepository.findByName(text)

    if (alreadExistMessage)
      throw new AppError('Já existe uma mensagem com esse texto')

    if (!text) throw new AppError('Nenhum texto foi informado para a mensagem')

    const messagesAmount = await this.messagesRepository.getEntries(userId)
    const code = (messagesAmount + 1).toString()

    const newMessage = this.messagesRepository.create({
      code,
      text,
      stage,
      userId,
      isDefault,
    })

    return newMessage
  }
}
