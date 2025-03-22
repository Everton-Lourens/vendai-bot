import { useForm } from 'react-hook-form'
import { ILogin, loginSchema } from '../interfaces/ILogin'
import { loginService } from '@/services/user/login/loginService'
import { httpClientProvider } from '@/providers/HttpClientProvider'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { saveLocalUser } from '@/utils/functions/storage/saveLocalUser'
import { saveLocalToken } from '@/utils/functions/storage/saveLocalToken'
import { useContext } from 'react'
import { AlertContext } from '@/contexts/alertContext'
import { AlertNotifyType } from '@/models/enums/AlertNotifyType'

export function useLogin() {
  const { alertNotifyConfigs, setAlertNotifyConfigs } = useContext(AlertContext)
  const router = useRouter()

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<ILogin>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(loginSchema),
  })

  async function onLogin(loginData: ILogin) {
    await loginService({
      http: httpClientProvider,
      loginData,
    })
      .then(async ({ data }) => {
        await Promise.all([
          saveLocalUser(data.user),
          saveLocalToken(data.token),
        ])

        router.push('/messages')
      })
      .catch((err) => {
        console.error('err', err)
        setAlertNotifyConfigs({
          ...alertNotifyConfigs,
          open: true,
          text: `Erro ao tentar realizar cadastro de usuário - ${err?.message}`,
          type: AlertNotifyType.ERROR,
        })
      })
  }

  return {
    handleSubmit,
    register,
    onLogin,
    isSubmitting,
    errors,
  }
}
