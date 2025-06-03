import { ChatbotClient } from "../entities/chatbot";

export interface BodyResponse {
   status: number;
   messageCode: string;
   userId?: string;
   clientId?: string;
   stage?: number;
   message?: string;
   response?: string;
   order?: object;
   timestamp?: string;
   client?: object;
   respondedClient?: any;
}

export function formatApiResponse({
   status,
   messageCode,
   respondedClient,
}: BodyResponse): BodyResponse {
   return {
      status,
      messageCode,
      timestamp: new Date().toISOString(),
      userId: respondedClient.userId,
      clientId: respondedClient.clientId,
      stage: respondedClient.stage,
      message: respondedClient.message,
      order: respondedClient.order,
      response: respondedClient.response,
   };
}

