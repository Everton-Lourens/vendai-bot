export interface CreateClientDTO {
  name: string
  cpf: string
  phone: string
  email: string
}

export interface ClientChatbotDTO {
  userId: string
  clientId: string
  message?: string
  [key: string]: any
  stage?: number
  response: string
  order?: {
    humanAttendant: boolean
    items: Array<any>
    address: null | any
  }
}

export const defaultClient: ClientChatbotDTO = {
  userId: '',
  message: '',
  userName: '',
  clientId: '',
  stage: 0,
  response: '',
  order: {
    humanAttendant: false,
    items: [],
    address: null,
  },
}

export interface UpdateClientDTO {
  name: string
  cpf: string
  phone: string
  email: string
  _id: string
}

export interface DeleteClientDTO {
  idClient: string
}

export interface GetAllClientsDTO {
  searchString: string | null
}
