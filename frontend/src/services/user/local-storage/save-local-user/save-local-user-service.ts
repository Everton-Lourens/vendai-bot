'use server'
import { cookies } from 'next/headers'
const USER_KEY = ':rental: [USER_INFO]'

interface IRequest {
  userData: {
    name: string
    email: string
    isAdmin: boolean
  }
}

export async function saveLocalUserService({ userData }: IRequest) {
  const cookieStore = await cookies()
  cookieStore.set(USER_KEY, JSON.stringify(userData)) // Ensure you are using a compatible cookie library or method

  globalThis?.localStorage?.setItem(USER_KEY, JSON.stringify(userData))
}
