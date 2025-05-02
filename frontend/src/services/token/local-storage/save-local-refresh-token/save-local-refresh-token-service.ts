'use server'

import { cookies } from 'next/headers'
const REFRESH_TOKEN_KEY = ':rental: [REFRESH_TOKEN]'

export async function saveRefreshToken(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(REFRESH_TOKEN_KEY, token)
  globalThis?.localStorage?.setItem(REFRESH_TOKEN_KEY, JSON.stringify(token))
}
