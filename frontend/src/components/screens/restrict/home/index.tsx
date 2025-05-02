'use client'
import React, { useState, useRef, useEffect } from 'react'
import './App.css'

type Message = {
  text: string
  sender: 'user' | 'bot'
}

type ChatbotClient = {
  id: string
  stage: number
  message: string
  response?: string
}

type ChatbotResponse = {
  data: {
    client: ChatbotClient
  }
}

export function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const messageListRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const port = 9999

  const [dataResponseChatbot, setDataResponseChatbot] = useState<{
    client: ChatbotClient
  }>({
    client: {
      id: '999',
      stage: 0,
      message: '',
    },
  })

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight
    }
  }, [messages])

  const apiChatbot = () => {
    const updatedClient = {
      ...dataResponseChatbot.client,
      message: input,
    }

    fetch(`http://localhost:${port}/v1/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ client: updatedClient }),
    })
      .then((response) => response.json())
      .then((data: ChatbotResponse) => {
        const { client } = data.data
        setDataResponseChatbot({ client })
        setTimeout(() => {
          if (client.response) {
            setMessages((prevMessages) => [
              ...prevMessages,
              { text: client.response!, sender: 'bot' },
            ])
          }
        }, 1000)
      })
      .catch((error) => {
        console.error('Erro ao enviar mensagem:', error)
      })
  }

  const sendMessageToChatbot = () => {
    if (input.trim()) {
      setMessages((prev) => [...prev, { text: input.trim(), sender: 'user' }])
      apiChatbot()
      setInput('')
      inputRef.current?.focus()
    }
  }

  const sendToJsonBackend = () => {
    window.open(`http://localhost:${port}/`, '_blank')
  }

  return (
    <div className="chat-container">
      <div ref={messageListRef} className="chat-box">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.sender}`}
            dangerouslySetInnerHTML={{
              __html: message.text.replace(/\n/g, '<br>'),
            }}
          />
        ))}
      </div>
      <div className="input-container">
        <button
          style={{ marginRight: '10px', backgroundColor: 'gray' }}
          onClick={sendToJsonBackend}
        >
          Backend
        </button>
        <input
          ref={inputRef}
          autoFocus
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessageToChatbot()}
          placeholder="Digite sua mensagem..."
        />
        <button onClick={sendMessageToChatbot}>Enviar</button>
      </div>
    </div>
  )
}
