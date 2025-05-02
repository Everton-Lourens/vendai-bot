'use client'

import { IUser } from '@/models/interfaces/i-user'
import { getLocalUserService } from '@/services/user/local-storage/get-local-user/get-local-user-service'
import { saveLocalUserService } from '@/services/user/local-storage/save-local-user/save-local-user-service'
import { ReactNode, createContext, useState, useEffect } from 'react'

interface UserContextComponentProps {
  children: ReactNode
  serverUserInfo: IUser
}

interface UserContextInterface {
  userInfo: IUser | null
  setUserInfo: (userInfo: IUser | null) => void
}

export const UserContext = createContext({} as UserContextInterface)

export function UserContextComponent({
  children,
  serverUserInfo,
}: UserContextComponentProps) {
  const [userInfo, setUserInfo] = useState<IUser | null>(serverUserInfo || null)

  async function saveUserHandler(updatedInfos: IUser) {
    const localUser: IUser = await getLocalUserService()
    saveLocalUserService({
      userData: { ...localUser, ...updatedInfos },
    })
  }

  useEffect(() => {
    saveUserHandler(userInfo as IUser)
  }, [userInfo])

  return (
    <UserContext.Provider
      value={{
        userInfo,
        setUserInfo,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
