'use client'

import { CustomTextField } from '@/components/_ui/CustomTextField'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import style from './ChatBot.module.scss'
import { useChat } from 'ai/react'

export function ChatBotComponent() {
  const { messages, input, handleInputChange, handleSubmit } = useChat()

  return (
    <section className={style.chatContainer}>
      <div className={style.messagesContainer}>
        {messages.map((msg) => {
          return (
            <div key={msg.id}>
              {msg.role}: {msg.content}
            </div>
          )
        })}
      </div>
      <form className={style.formContainer} onSubmit={handleSubmit}>
        <CustomTextField
          placeholder="Digite a sua mensagem"
          value={input}
          onChange={handleInputChange}
        />

        <button className={style.sendMessageButton} type="submit">
          <FontAwesomeIcon icon={faAngleRight} />
        </button>
      </form>
    </section>
  )
}
