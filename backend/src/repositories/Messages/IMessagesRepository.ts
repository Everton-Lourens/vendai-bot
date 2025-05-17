import { Types } from 'mongoose'
import { Message } from '../../entities/message'

export interface INewMessageDTO {
  text: string
  stage: number
  position: number
  userId: string
  isDefault: boolean
}

export interface UpdateStockParams {
  messageId: string
  amount: number
}

export interface UpdateParams {
  filters: any
  updateFields: any
}

export interface FiltersListMessages {
  userId: string
  searchString: string
  onlyDefault: boolean
}

export interface IMessagesRepository {
  list: ({
    userId,
    searchString,
    onlyDefault,
  }: FiltersListMessages) => Promise<Message[]>
  create: (MessageData: INewMessageDTO) => Promise<Message>
  createDefault(params: { userId: string }): Promise<Message[]>
  delete: (idMessage: string) => Promise<void>
  findByName: (text: string) => Promise<Message>
  findById: (messageId: string | Types.ObjectId) => Promise<Message>
  update: (updateParams: UpdateParams) => Promise<void>
  getEntries: (userId: string) => Promise<number>
}
