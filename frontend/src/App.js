import React, { useState, useRef, useEffect } from 'react';
import './App.css';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messageListRef = useRef(null);
  
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]); // Sempre que `chatMessages` mudar, o chat rola para baixo

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages([
        ...messages,
        { text: input, sender: 'user' },
        { text: 'Pensando...', sender: 'bot' },
      ]);
      setInput('');
      
      // Simulando a resposta do bot após 1 segundo
      setTimeout(() => {
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          updatedMessages[updatedMessages.length - 1] = { text: 'Resposta do bot', sender: 'bot' };
          return updatedMessages;
        });
      }, 1000);
    }
  };

  return (
    <div className="chat-container">
      <div ref={messageListRef} className="chat-box">
        {messages.map((message, index) => (
          <div
            key={index}
            className={message.sender === 'user' ? 'message user' : 'message bot'}
          >
            <p>{message.text}</p>
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite sua mensagem..."
        />
        <button onClick={handleSendMessage}>Enviar</button>
      </div>
    </div>
  );
};

export default App;
