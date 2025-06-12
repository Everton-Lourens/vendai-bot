import { ChatTableComponent } from '../../_ui/ChatTableComponent'
import style from './Chat.module.scss'
import { useMessageList } from '../../../hooks/useMessageList'
import { useFormChatbot } from './hooks/useFormChatbot'

export function Chat() {
  const { communicateWithBot } = useFormChatbot()
  const { loadingMessages } = useMessageList({ otherFilters: null })

  const columns = [
    {
      headerName: 'Chatbot',
      field: 'chatbotMessage',
      valueFormatter: ({ value }: { value: string }) =>
        `(${'Chatbot'}): ${value}`,
      cellClass: () => 'light-blue',
    },
    {
      headerName: 'Cliente',
      field: 'clientMessage',
      valueFormatter: ({ value }: { value: string }) => `(${'Você'}): ${value}`,
      cellClass: () => 'light-blue',
    },
  ]
  const messages = [
    {
      _id: '1',
      chatbotMessage: 'Olá! Como posso te ajudar?',
    },
  ]

  return (
    <>
      <div className={style.viewDesktop}>
        <ChatTableComponent
          loading={loadingMessages}
          chatbot={communicateWithBot}
          columns={columns}
          rows={messages}
          emptyText="Nenhuma mensagem cadastrada"
        />
      </div>
    </>
  )
}
