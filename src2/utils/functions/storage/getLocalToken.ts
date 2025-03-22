'use server'

import { StorageKeys } from '@/models/enums/StorageKeys'
import { cookies } from 'next/headers'

export async function getLocalToken() {
  const tokenCookie = cookies().get(StorageKeys.TOKEN)
  if (tokenCookie) return tokenCookie

  const tokenLocalStorage = globalThis?.localStorage?.getItem(StorageKeys.TOKEN)
  if (tokenLocalStorage) return tokenLocalStorage

  return null
}
