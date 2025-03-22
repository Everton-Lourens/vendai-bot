import './ChatScreen.css';
import React, { useEffect, useState } from 'react';

const ChatScreen = () => {
  const [responseChatBot, setResponseChatBot] = useState({});
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);


  const sendMessage = () => {
    if (message.trim() !== '') {
      // Em uma versão sem socket, aqui você poderia enviar a mensagem para o servidor
      setChatMessages((prevMessages) => [...prevMessages, { text: message, sender: "me" }]);
      setMessage('');      
    }
  };

  useEffect(() => {
    fetch('http://localhost:3005/v1/chat', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: '123456',
        stage: 0,
        message: 'ola'
      }),
    }).then((response) => response.json())
      .then((data) => {
        setChatMessages((prevMessages) => [...prevMessages, { text: data.client.response, sender: "bot" }]);
        setResponseChatBot(data);
      })
      .catch((error) => {
        console.error('Erro ao enviar mensagem:', error);
      })

  }, []);
  return (
    <div style={styles.container}>
      <ul style={styles.messageList}>
        {chatMessages.map((msg, index) => (
          <li
            key={index}
            style={msg.sender === "me" ?
              {
                ...styles.message_me,
              } :
              {
                ...styles.message,
              }}
          >
            {msg.text}
          </li>
        ))}
      </ul>
      <div style={styles.inputContainer}>
        <input
          type="text"
          style={styles.input}
          placeholder="Digite sua mensagem..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage} style={styles.button}>Enviar</button>
      </div>
    </div>
  );
};


// Define the styles object
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f5f5f5',
  },
  messageList: {
    listStyleType: 'none',
    padding: 0,
    width: '80%',
    maxHeight: '70vh',
    overflowY: 'auto',
    marginBottom: '10%',
  },
  message: {
    padding: "10px 15px",
    borderRadius: "10px",
    marginBottom: "10px",
    maxWidth: "100%",
    wordBreak: "break-word",
    backgroundColor: "#bac8d6",
  },
  message_me: {
    padding: "10px 15px",
    borderRadius: "10px",
    marginBottom: "10px",
    maxWidth: "100%",
    wordBreak: "break-word",
    backgroundColor: "#e0e0e0",
    textAlign: "right",
  },
  inputContainer: {
    display: 'flex',
    width: '60%',
    position: 'absolute',
    bottom: '10%',
  },
  input: {
    flex: 1,
    padding: '15px',
    borderRadius: '10px',
    border: '1px solid #ccc',
    marginRight: '10px',
  },
  button: {
    padding: '10px 20px',
    borderRadius: '20px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
  },

};

export default ChatScreen;
