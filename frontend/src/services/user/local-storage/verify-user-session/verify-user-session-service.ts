import { redirect } from 'next/navigation'
import { getLocalUserService } from '../get-local-user/get-local-user-service'

export async function verifyUserSessionService() {
  const user = await getLocalUserService()

  if (!user) redirect('/authenticate')

  return user
}
