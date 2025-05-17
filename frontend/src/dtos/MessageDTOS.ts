export interface GetAllMessagesDTO {
  filters: any
}

export interface CreateMessageDTO {
  text: string
  position: number
  isDefault: boolean
}

export interface UpdateMessageDTO {
  _id: string
  text: string
  position: number
  isDefault: boolean
}

export interface DeleteMessageDTO {
  idMessage: string
}
