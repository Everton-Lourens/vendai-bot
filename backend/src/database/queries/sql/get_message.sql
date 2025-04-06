-- Pegando as mensagens de um chatbot especifico
SELECT 
    message.stage,
    message.message_number,
    message.content
FROM chatbot_message AS message
JOIN chatbot AS bot ON message.chatbot_id = 'e3184ba4-f29b-4d3e-a961-6603cd388517';