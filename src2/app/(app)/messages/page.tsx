import { MessagesComponent } from '@/components/screens/Messages'
import { verifyUserSession } from '@/utils/functions/storage/verifyUserSession'

export default async function Messages() {
  await verifyUserSession()

  return <MessagesComponent />
}
