-- Pegando as mensagens de um chatbot especifico
        SELECT 
            stage,
            message_number,
            content
        FROM chatbot_message
        WHERE chatbot_id = 'e3184ba4-f29b-4d3e-a961-6603cd388517' -- $1
        ORDER BY stage, message_number;