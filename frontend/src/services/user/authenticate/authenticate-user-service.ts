import { IHttpClientProvider } from '@/providers/http-client-provider/i-http-client-provider'

interface IRequest {
  email: string
  password: string
}

export async function authenticateUserService(
  { email, password }: IRequest,
  httpClientProvider: IHttpClientProvider,
) {
  return httpClientProvider.post('/sessions', {
    email,
    password,
  })
}
