import React, { useState, useRef, useEffect } from 'react';
import './App.css';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messageListRef = useRef(null);
  const [messageResponse, setMessageResponse] = useState('');

  const [dataResponseChatbot, setDataResponseChatbot] = useState({
    client: {
      id: 999,
      stage: 0,
      message: '',
    }
  });

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]); // Sempre que `chatMessages` mudar, o chat rola para baixo

  const sendMessageToChatbot = () => {
    if (input.trim()) {
      setMessages([
        ...messages,
        { text: input, sender: 'user' },
      ]);
      apiChatbot();
      setTimeout(() => {
        sendMessageFromChatbot();
      }, 1000);
      setInput('');
    }
  };

  const apiChatbot = async () => {
    fetch('http://localhost:3005/v1/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataResponseChatbot),
    }).then((response) => response.json())
      .then((data) => {
        const { client } = data?.data;
        setDataResponseChatbot({ client });
        setMessageResponse(data?.data?.client?.response);
      })
      .catch((error) => {
        console.error('Erro ao enviar mensagem:', error);
      });
  };


  const sendMessageFromChatbot = React.useCallback(() => {
    !messageResponse && apiChatbot();
    messageResponse && setMessages((prevMessages) => [...prevMessages, { text: messageResponse, sender: "bot" }]);
  }, [messageResponse]);


  useEffect(() => {
    setTimeout(() => {
      sendMessageFromChatbot();
    }, 500);
  }, [messageResponse, sendMessageFromChatbot]);

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
          onKeyDown={(e) => e.key === "Enter" && sendMessageToChatbot()}
          placeholder="Digite sua mensagem..."
        />
        <button onClick={sendMessageToChatbot}>Enviar</button>
      </div>
    </div>
  );
};

export default App;
