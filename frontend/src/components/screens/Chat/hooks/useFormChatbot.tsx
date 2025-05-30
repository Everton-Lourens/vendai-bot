import { useContext, useState } from 'react'
import { AlertContext } from '../../../../contexts/alertContext'
import { chatbotService } from '../../../../services/chatbotService'
import { httpClientProvider } from '../../../../providers/HttpClientProvider'
import { ALERT_NOTIFY_TYPE } from '../../../../models/enums/AlertNotifyType'

export function useFormChatbot() {
  const { alertNotifyConfigs, setAlertNotifyConfigs } = useContext(AlertContext)

  const [anchorEl, setAnchorEl] = useState<Element | null>(null)

  async function communicateWithBot(message: string): Promise<string | false> {
    const response = await chatbotService
      .sendMessageToBot({ message }, httpClientProvider)
      .catch((err) => {
        setAlertNotifyConfigs({
          ...alertNotifyConfigs,
          open: true,
          type: ALERT_NOTIFY_TYPE.ERROR,
          text: `Erro ao tentar enviar mensagem - ${err?.message}`,
        })
      })
    return response.data.data.client.response || false
  }

  return {
    communicateWithBot,
    anchorEl,
    setAnchorEl,
  }
}
