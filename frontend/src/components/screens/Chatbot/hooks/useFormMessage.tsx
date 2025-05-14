import { useContext, useState } from 'react'
import { INewMessage, newMessageSchema } from '../interfaces/INewMessage'
import { useRouter } from 'next/router'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { AlertContext } from '../../../../contexts/alertContext'
import { IMessage } from '../../../../models/interfaces/IMessage'
import { messageService } from '../../../../services/messageService'
import { httpClientProvider } from '../../../../providers/HttpClientProvider'
import { ALERT_NOTIFY_TYPE } from '../../../../models/enums/AlertNotifyType'

type Props = {
  handleClose: () => void
  messageDataToEdit: IMessage | null
}

export function useFormMessage({ handleClose, messageDataToEdit }: Props) {
  const { alertNotifyConfigs, setAlertNotifyConfigs } = useContext(AlertContext)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<INewMessage>({
    defaultValues: messageDataToEdit || {
      text: '',
      stage: 0,
      isDefault: false,
    },
    resolver: zodResolver(newMessageSchema),
  })

  const isDefault = watch('isDefault')

  const router = useRouter()
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)

  function onCreateNewMessage(newMessage: INewMessage) {
    console.log(newMessage)
    messageService
      .create({ ...newMessage }, httpClientProvider)
      .then(() => {
        router.push({
          pathname: router.route,
          query: router.query,
        })

        reset()

        handleClose()

        setAlertNotifyConfigs({
          ...alertNotifyConfigs,
          open: true,
          type: ALERT_NOTIFY_TYPE.SUCCESS,
          text: 'Mensagem cadastrada com sucesso',
        })
      })
      .catch((err) => {
        setAlertNotifyConfigs({
          ...alertNotifyConfigs,
          open: true,
          type: ALERT_NOTIFY_TYPE.ERROR,
          text: `Erro ao tentar cadastrar mensagem - ${err?.message}`,
        })
      })
  }

  async function onEditMessage(message: INewMessage) {
    await messageService
      .update({ ...message, _id: message._id || '' }, httpClientProvider)
      .then(() => {
        router.push({
          pathname: router.route,
          query: router.query,
        })

        reset()

        handleClose()

        setAlertNotifyConfigs({
          ...alertNotifyConfigs,
          open: true,
          type: ALERT_NOTIFY_TYPE.SUCCESS,
          text: 'Dados da mensagem atualizado com sucesso',
        })
      })
      .catch((err) => {
        setAlertNotifyConfigs({
          ...alertNotifyConfigs,
          open: true,
          type: ALERT_NOTIFY_TYPE.ERROR,
          text: `Erro ao tentar atualizar dados da mensagem (${err?.message})`,
        })
      })
  }

  return {
    onCreateNewMessage,
    onEditMessage,
    register,
    handleSubmit,
    setValue,
    errors,
    isSubmitting,
    isDefault,
    anchorEl,
    setAnchorEl,
  }
}
