'use server'

import { cookies } from 'next/headers'
const USER_KEY = ':rental: [USER_INFO]'

export async function deleteLocalUserService() {
  const cookieStore = await cookies()
  cookieStore.delete(USER_KEY)
  globalThis?.localStorage?.removeItem(USER_KEY)
}
