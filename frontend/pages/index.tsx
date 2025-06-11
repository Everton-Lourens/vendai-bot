import { useToken } from '../src/components/screens/Dashboard/hooks/useToken'
import { Dashboard } from '../src/components/screens/Dashboard'
import { usersService } from '../src/services/usersService'
import { useRouter } from 'next/router'

export default function Home() {
  const { getTokenSession } = useToken()
  const token = getTokenSession()
  const router = useRouter()
  const restrictLayout =
    router.route !== '/login' && router.route !== '/createAccount'
  if (!token && restrictLayout) {
    router.push('/login')
  }
  return (
    <>
      <Dashboard />
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
      props: {},
    }
  }
  return {
    props: { session },
  }
}
