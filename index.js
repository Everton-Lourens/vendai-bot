function formatApiResponse({ status, message, data = null, errorCode = null }) {
    return {
      status: status,
      message: message,
      timestamp: new Date().toISOString(),  // Data e hora atual em formato ISO 8601
      data: data,  // Dados retornados, caso existam
      error_code: errorCode,  // Código de erro, caso haja
    };
  }
  
  // Exemplo de uso para sucesso
  const successResponse = formatApiResponse({
    status: 200,
    message: 'Operação realizada com sucesso',
    data: {
      user_id: 12345,
      name: 'Jane Doe',
      email: 'janedoe@example.com',
    }
  });
  console.log(successResponse);
  
  // Exemplo de uso para erro
  const errorResponse = formatApiResponse({
    status: 500,
    message: 'Erro desconhecido ao executar o chatbot',
errorCode: { code: 'CHATBOT_UNKNOWN_ERROR' }
  });
  console.log(errorResponse);
  