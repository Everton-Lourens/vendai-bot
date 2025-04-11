import React, { useState, useRef, useEffect } from 'react';
import './App.css';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messageListRef = useRef(null);
  const inputRef = useRef(null);
  const port = 9999;

  const [dataResponseChatbot, setDataResponseChatbot] = useState({
    client: {
      id: '999', //id default to test
      stage: 0,
      message: input,
    }
  });

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]); // Sempre que `chatMessages` mudar, o chat rola para baixo

  const apiChatbot = () => {

    dataResponseChatbot.client.message = input;

    fetch(`http://localhost:${port}/v1/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataResponseChatbot),
    }).then((response) => response.json())
      .then((data) => {
        const { client } = data?.data;
        setDataResponseChatbot({ client });
        console.log(data?.data?.client?.response?.replace(/\n/g, "<br>"));
        setTimeout(() => {
          data?.data?.client?.response && setMessages((prevMessages) => [...prevMessages, { text: data?.data?.client?.response, sender: "bot" }]);
        }, 1000);
      })
      .catch((error) => {
        console.error('Erro ao enviar mensagem:', error);
      });
  };

  const sendMessageToChatbot = () => {
    if (input.trim()) {
      setMessages([
        ...messages,
        { text: input, sender: 'user' },
      ]);
      apiChatbot();
      setInput('');
      inputRef.current?.focus(); // Foca novamente no input
    }
  };

  const sendToJsonBackend = () => {
    window.open(`http://localhost:${port}/`, '_blank');
  };

  return (
    <div className="chat-container">
      <div ref={messageListRef} className="chat-box">
        {messages.map((message, index) => (
          <div
            key={index}
            className={message.sender === 'user' ? 'message user' : 'message bot'}
            dangerouslySetInnerHTML={{ __html: message?.text?.replace(/\n/g, "<br>").replace("\n", "<br>") }}
          ></div>
        ))}
      </div>
      <div className="input-container">
        <button style={{ marginRight: '10px', backgroundColor: 'gray' }} onClick={sendToJsonBackend}>Backend</button>
        <input
          ref={inputRef}
          autoFocus
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
