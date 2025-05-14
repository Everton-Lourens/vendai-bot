import { Chatbot } from '../../src/components/screens/Chatbot'
import { usersService } from '../../src/services/usersService'

export default function ChatbotPage() {
  return (
    <>
      <Chatbot />
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
