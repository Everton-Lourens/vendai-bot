import { redirect } from 'next/navigation'
import { verifyUserSessionService } from '../verify-user-session/verify-user-session-service'

export async function verifyUserIsAdminService() {
  const user = await verifyUserSessionService()

  const userHasAdminPermission = !!user.isAdmin

  if (!userHasAdminPermission) redirect('/')
}
