import { Messages } from '../../src/components/screens/Messages'
import { usersService } from '../../src/services/usersService'

export default function ChatbotPage() {
  return (
    <>
      <Messages />
    </>
  )
}

export const getServerSideProps = async (context: any) => {
  const session = await usersService.getSession(context)

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: '/login',
      },
    }
  }
  return {
    props: {
      session,
    },
  }
}
