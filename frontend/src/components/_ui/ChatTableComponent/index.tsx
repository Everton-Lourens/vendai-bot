import { useState } from 'react'
import style from './ChatTableComponent.module.scss'
import { Column } from './interfaces'
import { Skeleton } from '@mui/material'

interface Props {
  columns: Column[]
  rows: any[]
  loading: boolean
  emptyText?: string
  heightSkeleton?: number
}

export function ChatTableComponent({
  columns,
  rows,
  loading,
  emptyText,
  heightSkeleton = 30,
}: Props) {
  const [message, setMessage] = useState('')

  const handleChatbotSendMessage = (message: string) => {
    if (!message || message.trim() === '') {
      return false
    }
    // HOOK PARA O CHATBOT
    const newMessage = {
      _id: (rows.length + 1).toString(),
      chatbotMessage: message,
    }
    rows.push(newMessage)
    return true
  }
  const handleClientSendMessage = (message: string) => {
    if (!message || message.trim() === '') {
      return false
    }
    const response = handleChatbotSendMessage(message)
    if (response) {
      const newMessage = {
        _id: (rows.length + 1).toString(),
        clientMessage: message,
      }
      rows.push(newMessage)
    }
  }



  return (
    <table style={loading ? { opacity: 0.5 } : {}} className={style.table}>

      <tbody className={style.chat}>
        {rows.length > 0 &&
          !loading &&
          rows?.map((row) => {
            return (
              <tr
                key={row._id}
                className={
                  row['clientMessage']
                    ? style.bubbleClient
                    : style.bubbleChatbot
                }
              >
                {columns.map((column) => {
                  return (
                    <td
                      className={column?.cellClass?.({
                        value: row[column.field],
                        data: row,
                      })}
                      key={column.field}
                      style={{ flex: 1 }}
                    >
                      {column?.valueFormatter?.({
                        value: row[column.field],
                        data: row,
                      }) && row[column.field]}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        {rows.length === 0 && !loading && (
          <tr className={style.emptyRow}>
            <td className={style.emptyCell} colSpan={columns.length}>
              <p>{emptyText || 'Nenhum item encontrado'}</p>
            </td>
          </tr>
        )}

        {loading &&
          [1, 2, 3, 4, 5].map((item) => {
            return (
              <tr key={item}>
                {columns.map((column) => {
                  return (
                    <td
                      className={style.skeleton}
                      key={column.field}
                      style={{ flex: 1 }}
                    >
                      <Skeleton
                        variant="rounded"
                        height={heightSkeleton}
                        sx={{ fontSize: '1rem', borderRadius: 15 }}
                      />
                    </td>
                  )
                })}
              </tr>
            )
          })}
        {!loading && (
          <div className={style.chatInputContainer}>
            <input
              type="text"
              className={style.chatInput}
              placeholder="Digite uma mensagem..."
              autoFocus
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleClientSendMessage(message)
                  setMessage('')
                }
              }}
            />
            <button
              className={style.sendButton}
              onClick={() => {
                handleClientSendMessage(message)
                setMessage('')
              }}
            >
              Enviar
            </button>
          </div>
        )}
      </tbody>
    </table>
  )
}
