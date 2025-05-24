import { Chat } from '../../src/components/screens/Chat'
import { usersService } from '../../src/services/usersService'

export default function ChatPage() {
  return (
    <>
      <Chat />
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
