'use server'

import { StorageKeys } from '@/models/enums/StorageKeys'
import { IUser } from '@/models/interfaces/IUser'
import { cookies } from 'next/headers'

export async function saveLocalUser(user: IUser) {
  globalThis?.localStorage?.setItem(StorageKeys.USER, JSON.stringify(user))

  cookies().set({
    name: StorageKeys.USER,
    value: JSON.stringify(user),
  })
}
