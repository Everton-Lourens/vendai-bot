/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpStatusCode } from '@/models/enums/http-status-code'
import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios'

export class AxiosHttpClientProvider {
  private httpInstance: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })

  private static _instance = new AxiosHttpClientProvider()

  constructor() {
    if (AxiosHttpClientProvider._instance) {
      throw new Error(
        'Erro ao criar instância do AxiosHttpClientProvider. Execute getInstance() para criar uma nova',
      )
    }
    AxiosHttpClientProvider._instance = this

    this.httpInstance.interceptors.request.use(
      async (config: any) => {
        const token = null // TODO: await getTokenService()

        return {
          ...config,
          headers: {
            ...config.headers,
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      },
      (error) => {
        return Promise.reject(error)
      },
    )

    this.httpInstance.interceptors.response.use(
      (config: AxiosResponse) => config,
      async (error: AxiosError) => {
        const tokenExpired =
          error?.response?.status === HttpStatusCode.unauthorized

        if (tokenExpired) {
          try {
            // TODO: Implement get refresh token logic

            // const refreshToken = null // await getRefreshToken()

            // const { data } = await updateRefreshTokenService(
            //   refreshToken,
            //   httpClientProvider,
            // )

            // saveTokenService(data.token)
            // saveRefreshToken(data.refreshToken)

            return Promise.resolve()
          } catch (errorRefreshToken) {
            // deleteTokenService()
            // deleteRefreshTokenService()
            // deleteLocalUserService()
            return Promise.reject(errorRefreshToken)
          }
        }

        return Promise.reject(error)
      },
    )
  }

  public static getInstance(): AxiosHttpClientProvider {
    return AxiosHttpClientProvider._instance
  }

  async post(url: string, body?: any, options?: any) {
    let axiosResponse: AxiosResponse

    try {
      axiosResponse = await this.httpInstance.post(url, body, options)
    } catch (error) {
      const _error = error as AxiosError<{ message: string }>
      throw new Error(_error?.response?.data?.message)
    }

    return {
      statusCode: axiosResponse?.status,
      data: axiosResponse?.data,
    }
  }

  async put(url: string, body?: any, options?: any) {
    let axiosResponse: AxiosResponse

    try {
      axiosResponse = await this.httpInstance.put(url, body, options)
    } catch (error) {
      const _error = error as AxiosError<{ message: string }>
      throw new Error(_error?.response?.data?.message)
    }

    return {
      statusCode: axiosResponse?.status,
      data: axiosResponse?.data,
    }
  }

  async get(url: string, options?: any) {
    let axiosResponse: AxiosResponse

    try {
      axiosResponse = await this.httpInstance.get(url, options)
    } catch (error) {
      const _error = error as AxiosError<{ message: string }>
      throw new Error(_error?.response?.data?.message)
    }

    return {
      statusCode: axiosResponse?.status,
      data: axiosResponse?.data,
    }
  }

  async patch(url: string, body?: any, options?: any) {
    let axiosResponse: AxiosResponse

    try {
      axiosResponse = await this.httpInstance.patch(url, body, options)
    } catch (error) {
      const _error = error as AxiosError<{ message: string }>
      throw new Error(_error?.response?.data?.message)
    }

    return {
      statusCode: axiosResponse?.status,
      data: axiosResponse?.data,
    }
  }

  async delete(url: string, options?: any) {
    let axiosResponse: AxiosResponse

    try {
      axiosResponse = await this.httpInstance.delete(url, options)
    } catch (error) {
      const _error = error as AxiosError<{ message: string }>
      throw new Error(_error?.response?.data?.message)
    }

    return {
      statusCode: axiosResponse?.status,
      data: axiosResponse?.data,
    }
  }
}
