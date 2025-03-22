import { IUser } from '@/models/interfaces/IUser'
import { createContext, ReactNode, useState } from 'react'

interface UserContextComponentProps {
  children: ReactNode
}

interface IUserContext {
  userData: IUser | null
  setUserData: (userData: IUser) => void
}

export const UserContext = createContext({} as IUserContext)

export function UserContextComponent({ children }: UserContextComponentProps) {
  const [userData, setUserData] = useState<IUser | null>(null)

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  )
}
