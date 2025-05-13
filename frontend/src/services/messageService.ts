import dayjs from 'dayjs'
import { usersService } from './usersService'
import utc from 'dayjs/plugin/utc'
import { IHttpClientProvider } from '../providers/HttpClientProvider/IHttpClientProvider'
import {
  CreateMessageDTO,
  DeleteMessageDTO,
  GetAllMessagesDTO,
  UpdateMessageDTO,
} from '../dtos/MessageDTOS'
dayjs.extend(utc)

export const messageService = {
  userInfo: usersService.getUserInfo(),

  getAll(
    { filters: { startDate, endDate, status } }: GetAllMessagesDTO,
    httpClientProvider: IHttpClientProvider,
  ) {
    const params = {
      ...(status ? { status } : {}),
      ...(startDate
        ? { startDate }
        : { startDate: dayjs.utc().startOf('month').toISOString() }),
      ...(endDate
        ? { endDate }
        : { endDate: dayjs.utc().endOf('month').toISOString() }),
      userId: this.userInfo?._id,
    }

    return httpClientProvider.get('/message/', {
      params,
    })
  },

  create(
    { newMessageData, totalValue }: CreateMessageDTO,
    httpClientProvider: IHttpClientProvider,
  ) {
    const body = {
      ...newMessageData,
      totalValue,
      userInfo: this.userInfo,
    }

    return httpClientProvider.post('/message', {
      ...body,
    })
  },

  update(
    { messageData, totalValue }: UpdateMessageDTO,
    httpClientProvider: IHttpClientProvider,
  ) {
    const body = {
      ...messageData,
      totalValue,
    }

    return httpClientProvider.put('/message', {
      ...body,
    })
  },

  cancel(
    { idMessage }: DeleteMessageDTO,
    httpClientProvider: IHttpClientProvider,
  ) {
    return httpClientProvider.put(`/message/cancelar/`, {
      _id: idMessage,
    })
  },
}
