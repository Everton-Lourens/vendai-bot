export interface GetAllMessagesDTO {
  filters: any
}

export interface CreateMessageDTO {
  text: string
  stage: number
  isDefault: boolean
}

export interface UpdateMessageDTO {
  _id: string
  text: string
  stage: number
  isDefault: boolean
}

export interface DeleteMessageDTO {
  idMessage: string
}
