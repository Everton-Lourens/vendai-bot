import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { messageService } from '../services/messageService'
import { httpClientProvider } from '../providers/HttpClientProvider'
import { IMessage } from '../models/interfaces/IMessage'
import { STATUS_MESSAGE } from '../models/enums/MessageStatus'

type Props = {
  otherFilters: {
    status?: STATUS_MESSAGE
  } | null
}

export function useMessageList({ otherFilters }: Props) {
  const [messages, setMessages] = useState<IMessage[]>([])
  const [loadingMessages, setLoadingMessages] = useState<boolean>(true)

  const router = useRouter()

  function getMessages() {
    setLoadingMessages(true)
    messageService
      .getAll(
        { filters: { ...router.query, ...otherFilters } },
        httpClientProvider,
      )
      .then((res) => {
        setMessages(res.data.items)
      })
      .catch((err) => {
        console.log('ERRO AO BUSCAR MENSAGENS, ', err)
      })
      .finally(() => {
        setLoadingMessages(false)
      })
  }

  useEffect(() => {
    getMessages()
  }, [router.query])

  return {
    messages,
    loadingMessages,
  }
}
