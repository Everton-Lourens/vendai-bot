import { IHttpClientProvider } from '@/providers/http-client-provider/i-http-client-provider'

export async function updateRefreshTokenService(
  token: string | null,
  httpClientProvider: IHttpClientProvider,
) {
  return httpClientProvider.post('refreshToken', {
    token,
  })
}
