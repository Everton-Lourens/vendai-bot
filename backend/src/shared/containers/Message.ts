import { container } from 'tsyringe'
import { MessagesRepository } from '../../repositories/Messages/MessagesRepository'
import { IMessagesRepository } from '../../repositories/Messages/IMessagesRepository'

container.registerSingleton<IMessagesRepository>(
  'MessagesRepository',
  MessagesRepository,
)
