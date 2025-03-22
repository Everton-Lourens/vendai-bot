'use server'

import { StorageKeys } from '@/models/enums/StorageKeys'
import { cookies } from 'next/headers'

export async function getLocalUser() {
  const userCookie = cookies().get(StorageKeys.USER)
  const userCookieParsed = JSON.parse(userCookie?.value || 'null')
  if (userCookieParsed) return userCookieParsed

  const userLocalStorage = globalThis?.localStorage?.getItem(StorageKeys.USER)
  const userLocalStorageParsed = JSON.parse(userLocalStorage || 'null')
  if (userLocalStorageParsed) return userLocalStorageParsed

  return null
}
