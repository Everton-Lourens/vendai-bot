import { Request, Response } from 'express'
import { chatbot } from '../chatbot'
import { ChatbotClient } from '../entities/chatbot'
export class ChatbotController {
  async sendMessageToChatbot(req: Request, res: Response): Promise<Response> {
    const client: ChatbotClient = req?.body?.params
    try {
      const responseData = await chatbot({ client });
      return res.status(201).json({
        data: responseData
      });
    } catch (error) {
      res.status(422).end();
      return error
    }
  }
}
