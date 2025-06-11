import { useRouter } from 'next/router'
import { ALERT_NOTIFY_TYPE } from '../../../../models/enums/AlertNotifyType'
import { IMessage } from '../../../../models/interfaces/IMessage'
import { httpClientProvider } from '../../../../providers/HttpClientProvider'
import { messageService } from '../../../../services/messageService'
import { AlertContext } from '../../../../contexts/alertContext'
import { useContext } from 'react'

export function useDeleteMessage() {
  const router = useRouter()

  const {
    alertDialogConfirmConfigs,
    setAlertDialogConfirmConfigs,
    alertNotifyConfigs,
    setAlertNotifyConfigs,
  } = useContext(AlertContext)

  function handleDeleteMessage(message: IMessage) {
    setAlertDialogConfirmConfigs({
      ...alertDialogConfirmConfigs,
      open: true,
      title: 'Alerta de confirmação',
      text: 'Deseja realmente excluir esta mensagem??',
      onClickAgree: () => {
        messageService
          .delete({ idMessage: message?._id }, httpClientProvider)
          .then(() => {
            setAlertNotifyConfigs({
              ...alertNotifyConfigs,
              open: true,
              type: ALERT_NOTIFY_TYPE.SUCCESS,
              text: 'Mensagem excluída com sucesso',
            })
            router.push({
              pathname: router.route,
              query: router.query,
            })
          })
          .catch((err: any) => {
            setAlertNotifyConfigs({
              ...alertNotifyConfigs,
              open: true,
              type: ALERT_NOTIFY_TYPE.ERROR,
              text: `Erro ao tentar excluir a mensagem - ${err?.message}`,
            })
          })
      },
    })
  }
  return {
    handleDeleteMessage,
  }
}
