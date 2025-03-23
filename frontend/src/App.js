import './ChatScreen.css';
import React, { useEffect, useState } from 'react';

const ChatScreen = () => {
  const [messageResponse, setMessageResponse] = useState('');
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [dataResponseChatbot, setDataResponseChatbot] = useState({
    client: {
      id: 0,
      stage: 0,
      message: '',
    }
  });
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
    messageResponse && setChatMessages((prevMessages) => [...prevMessages, { text: messageResponse, sender: "bot" }]);
  }, [messageResponse]);

  const sendMessageToChatbot = () => {
    if (message.trim() !== '') {
      apiChatbot();
      setChatMessages((prevMessages) => [...prevMessages, { text: message, sender: "me" }]);
      setMessage('');
      setTimeout(() => {
        sendMessageFromChatbot();
      }, 1000);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      sendMessageFromChatbot();
    }, 500);
  }, [messageResponse, sendMessageFromChatbot]);

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
          onKeyDown={(e) => e.key === 'Enter' && sendMessageToChatbot()}
        />
        <button onClick={sendMessageToChatbot} style={styles.button}>Enviar</button>
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
    width: '100%',
    maxHeight: '70vh',
    overflowY: 'auto',
    marginBottom: '10%',
  },
  message: {
    padding: "10px 15px",
    borderRadius: "10px",
    marginBottom: "10px",
    maxWidth: "45%",
    wordBreak: "break-word",
    backgroundColor: "rgb(220, 204, 241)", 
    marginLeft: "20%",
  },
  message_me: {
    padding: "10px 15px",
    borderRadius: "10px",
    marginBottom: "10px",
    maxWidth: "45%",
    wordBreak: "break-word",
    textAlign: "right",
    marginLeft: "auto",
    backgroundColor: "rgb(209, 209, 209)", //#bac8d6
    marginRight: "20%",
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
