import {
  CreateMessageDTO,
  DeleteMessageDTO,
  GetAllMessagesDTO,
  UpdateMessageDTO,
} from '../dtos/MessageDTOS'
import { ClientChatbotDTO } from '../dtos/ClientDTOS'
import { IHttpClientProvider } from './../providers/HttpClientProvider/IHttpClientProvider'
import { usersService } from './usersService'

export const chatbotService = {
  userInfo: usersService.getUserInfo(),
  sendMessageToBot(
    { client }: { client: ClientChatbotDTO },
    httpClientProvider: IHttpClientProvider,
  ) {
    const params = {
      ...client,
      userId: this.userInfo?._id,
      clientId: this.userInfo?._id, // Assuming clientId is the same as userId
      userName: this.userInfo?.name,
    }

    return httpClientProvider.post('/chat/chatbot', {
      params,
    })
  },
  getAll(
    { filters }: GetAllMessagesDTO,
    httpClientProvider: IHttpClientProvider,
  ) {
    const params = {
      ...filters,
      userId: this.userInfo?._id,
    }

    return httpClientProvider.get('/mensagens/', {
      params,
    })
  },

  getDefaultMessages(httpClientProvider: IHttpClientProvider) {
    const params = {
      userId: this.userInfo?._id,
    }

    return httpClientProvider.get('/mensagens/padroes/', {
      params,
    })
  },

  create(
    { text, position, isDefault }: CreateMessageDTO,
    httpClientProvider: IHttpClientProvider,
  ) {
    const body = {
      position,
      text,
      isDefault,
      userInfo: this.userInfo,
    }
    return httpClientProvider.post('/mensagens', {
      ...body,
    })
  },

  update(
    { _id, text, position, isDefault }: UpdateMessageDTO,
    httpClientProvider: IHttpClientProvider,
  ) {
    const body = {
      _id,
      text,
      position,
      isDefault,
    }

    return httpClientProvider.put('/mensagens/', {
      ...body,
    })
  },

  delete(
    { idMessage }: DeleteMessageDTO,
    httpClientProvider: IHttpClientProvider,
  ) {
    return httpClientProvider.delete(`/mensagens/`, {
      params: {
        idMessage,
      },
    })
  },
}
