import { IHttpClientProvider } from '../../../providers/HttpClientProvider/IHttpClientProvider'

interface IRequest {
  http: IHttpClientProvider
  registerData: {
    email: string
    password: string
    confirmPassword: string
  }
}

export async function registerService({ http, registerData }: IRequest) {
  return http.post('/user/register', registerData)
}
