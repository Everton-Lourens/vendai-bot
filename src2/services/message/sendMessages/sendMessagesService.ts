import { IHttpClientProvider } from '@/providers/HttpClientProvider/IHttpClientProvider'

interface IRequest {
  phones: string[]
  messageText: string
  http: IHttpClientProvider
}

export function sendMessagesService({ phones, messageText, http }: IRequest) {
  return http.post('/message/sendMultiMessage', {
    phones,
    messageText,
  })
}
