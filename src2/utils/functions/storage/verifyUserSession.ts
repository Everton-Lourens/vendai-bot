import { redirect } from 'next/navigation'
import { getLocalUser } from './getLocalUser'

export async function verifyUserSession() {
  const user = await getLocalUser()

  if (!user) redirect('/login')

  return user
}
