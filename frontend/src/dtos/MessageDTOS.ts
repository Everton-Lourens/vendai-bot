import { STATUS_MESSAGE } from '../models/enums/MessageStatus'

export interface GetAllMessagesDTO {
  filters: {
    status?: STATUS_MESSAGE
    startDate?: string | Date
    endDate?: string | Date
  }
}

export interface CreateMessageDTO {
  newMessageData: any
  totalValue: number
}

export interface UpdateMessageDTO {
  messageData: any
  totalValue: number
}

export interface DeleteMessageDTO {
  idMessage: string
}
