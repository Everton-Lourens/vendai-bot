import { useForm } from 'react-hook-form'
import { IRegister, registerSchema } from '../interfaces/IRegister'
import { registerService } from '@/services/user/register/registerService'
import { httpClientProvider } from '@/providers/HttpClientProvider'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useContext } from 'react'
import { AlertContext } from '@/contexts/alertContext'
import { AlertNotifyType } from '@/models/enums/AlertNotifyType'

export function useRegister() {
  const { alertNotifyConfigs, setAlertNotifyConfigs } = useContext(AlertContext)
  const router = useRouter()

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<IRegister>({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    resolver: zodResolver(registerSchema),
  })

  async function onRegister(registerData: IRegister) {
    await registerService({
      http: httpClientProvider,
      registerData,
    })
      .then(() => {
        setAlertNotifyConfigs({
          ...alertNotifyConfigs,
          open: true,
          text: 'Usuário cadastrado com sucesso',
          type: AlertNotifyType.SUCCESS,
        })

        router.push('/login')
      })
      .catch((err) => {
        console.error('error', err)
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
    onRegister,
    isSubmitting,
    errors,
  }
}
