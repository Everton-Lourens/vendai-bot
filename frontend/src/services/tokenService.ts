import { IHttpClientProvider } from '../providers/HttpClientProvider/IHttpClientProvider'
import { usersService } from './usersService'

export const tokenService = {
  userInfo: usersService.getUserInfo(),
  getTokenSession(httpClientProvider: IHttpClientProvider) {
    const params = {
      userId: this.userInfo?._id,
    }

    return httpClientProvider.get('/token', {
      params,
    })
  },
}
