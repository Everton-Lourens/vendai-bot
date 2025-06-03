import { useContext, useState } from 'react'
import { AlertContext } from '../../../../contexts/alertContext'
import { chatbotService } from '../../../../services/chatbotService'
import { httpClientProvider } from '../../../../providers/HttpClientProvider'
import { ALERT_NOTIFY_TYPE } from '../../../../models/enums/AlertNotifyType'
import { ClientChatbotDTO, defaultClient } from '../../../../dtos/ClientDTOS'

export function useFormChatbot() {
  const { alertNotifyConfigs, setAlertNotifyConfigs } = useContext(AlertContext)

  const [anchorEl, setAnchorEl] = useState<Element | null>(null)

  function communicateWithBot(client: ClientChatbotDTO): ClientChatbotDTO {
    if (Object.keys(client).length === 0) return defaultClient
    const response = chatbotService
      .sendMessageToBot(client, httpClientProvider)
      .catch((err) => {
        setAlertNotifyConfigs({
          ...alertNotifyConfigs,
          open: true,
          type: ALERT_NOTIFY_TYPE.ERROR,
          text: `Erro ao tentar enviar mensagem - ${err?.message}`,
        })
        return defaultClient
      })
    if (response && (response as any).data && (response as any).data.data) {
      return (response as any).data.data
    }
    return defaultClient
  }

  return {
    communicateWithBot,
    anchorEl,
    setAnchorEl,
  }
}
