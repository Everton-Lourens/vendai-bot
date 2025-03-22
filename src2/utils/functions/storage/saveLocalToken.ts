'use server'

import { StorageKeys } from '@/models/enums/StorageKeys'
import { cookies } from 'next/headers'

export async function saveLocalToken(token: string) {
  globalThis?.localStorage?.setItem(StorageKeys.TOKEN, token)

  cookies().set({
    name: StorageKeys.TOKEN,
    value: token,
  })
}
