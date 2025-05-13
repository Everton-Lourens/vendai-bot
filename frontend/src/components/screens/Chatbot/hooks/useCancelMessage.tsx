import { useRouter } from 'next/router'
import { ALERT_NOTIFY_TYPE } from '../../../../models/enums/AlertNotifyType'
import { IMessage } from '../../../../models/interfaces/IMessage'
import { httpClientProvider } from '../../../../providers/HttpClientProvider'
import { messageService } from '../../../../services/MessageService'
import { useContext } from 'react'
import { AlertContext } from '../../../../contexts/alertContext'

export function useCancelMessage() {
  const router = useRouter()

  const {
    alertDialogConfirmConfigs,
    setAlertDialogConfirmConfigs,
    alertNotifyConfigs,
    setAlertNotifyConfigs,
  } = useContext(AlertContext)

  function handleCancelMessage(message: IMessage) {
    setAlertDialogConfirmConfigs({
      ...alertDialogConfirmConfigs,
      open: true,
      title: 'Alerta de confirmação',
      text: 'Deseja realmente cancelar esta venda?',
      onClickAgree: () => {
        messageService
          .cancel({ idMessage: message?._id }, httpClientProvider)
          .then(() => {
            setAlertNotifyConfigs({
              ...alertNotifyConfigs,
              open: true,
              type: ALERT_NOTIFY_TYPE.SUCCESS,
              text: 'Venda cancelada com sucesso',
            })
            router.push({
              pathname: router.route,
              query: router.query,
            })
          })
          .catch((err) => {
            setAlertNotifyConfigs({
              ...alertNotifyConfigs,
              open: true,
              type: ALERT_NOTIFY_TYPE.ERROR,
              text: `Erro ao tentar cancelar a venda (${err?.message})`,
            })
          })
      },
    })
  }

  return {
    handleCancelMessage,
  }
}
