import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { CreateNewMessageService } from '../useCases/Message/CreateNewMessage/CreateNewMessageService.service'
import { UpdateNewMessageService } from '../useCases/Message/UpdateMessage/UpdateMessageService.service'
import { DeleteMessageService } from '../useCases/Message/DeleteMessage/DeleteMessageService.service'
import { ListMessageService } from '../useCases/Message/ListMessages/ListMessageService.service'
import { ListDefaultMessageService } from '../useCases/Message/ListDefaultMessages/ListDefaultMessagesService.service'
import { chatbot } from '../chatbot'

export class MessageController {
  async sendMessageToChatbot(req: Request, res: Response): Promise<Response> {

    const bodyRequest = {
      userId: "682a0547e82c591ac3a97d64",
      clientId: "f2b9e012-c3e5-4c5a-91d3-25c8990eea4a",
      stage: 0,
      message: "Olá"
    };

    console.log('@@@@@@@@@@@@@@@@@@@@@@')

    try {
      const responseData = await chatbot(bodyRequest);
      return res.status(201).json({
        data: responseData
      });
    } catch (error) {
      return res.status(422).end();
    }
  }
  async listMessages(req: Request, res: Response): Promise<Response> {
    const { searchString } = req.query as any
    const { userId } = req.user

    const listMessageService = container.resolve(ListMessageService)
    const messages = await listMessageService.execute({
      searchString,
      userId,
    })

    return res.status(200).json({
      success: true,
      items: messages,
      message: 'Busca de mensagens concluída com sucesso',
    })
  }

  async getDefaultMessages(req: Request, res: Response): Promise<Response> {
    const { userId } = req.query as any

    const listDefaultMessageService = container.resolve(
      ListDefaultMessageService,
    )

    const messages = await listDefaultMessageService.execute({
      userId,
    })

    return res.status(200).json({
      success: true,
      items: messages,
      message: 'Busca de mensagens concluída com sucesso',
    })
  }

  async createNewMessage(req: Request, res: Response): Promise<Response> {
    const { text, stage, position, isDefault, userInfo } = req.body
    const createNewMessageService = container.resolve(CreateNewMessageService)

    const newMessage = await createNewMessageService.execute({
      text,
      stage,
      position,
      isDefault,
      userId: userInfo?._id,
    })

    return res.status(201).json({
      success: true,
      item: newMessage,
      message: 'Mensagem cadastrada com sucesso',
    })
  }

  async updateMessage(req: Request, res: Response): Promise<Response> {
    const { text, _id: idMessage, stage, position, isDefault } = req.body

    const updateNewMessageService = container.resolve(UpdateNewMessageService)
    const updatedMessage = await updateNewMessageService.execute({
      text,
      idMessage,
      stage,
      position,
      isDefault,
    })

    return res.status(202).json({
      success: true,
      updatedMessage,
      message: 'Mensagem atualizado com sucesso',
    })
  }

  async deleteMessage(req: Request, res: Response): Promise<Response> {
    const { idMessage } = req.query as any

    const deleteMessageService = container.resolve(DeleteMessageService)
    await deleteMessageService.execute(idMessage)

    return res.status(202).json({
      success: true,
      message: 'Mensagem excluído com sucesso',
    })
  }
}
