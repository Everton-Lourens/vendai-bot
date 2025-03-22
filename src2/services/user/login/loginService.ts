import { IHttpClientProvider } from '@/providers/HttpClientProvider/IHttpClientProvider'

interface IRequest {
  http: IHttpClientProvider
  loginData: {
    email: string
    password: string
  }
}

export function loginService({ http, loginData }: IRequest) {
  return http.post('/user/authenticate', loginData)
}
