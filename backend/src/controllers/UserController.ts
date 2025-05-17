import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { CreateNewUserService } from '../useCases/User/CreateNewUser/CreateNewUserService.service'
import { CreateDefaultMessageService } from '../useCases/Message/CreateNewMessage/CreateDefaultMessageService.service'

export class UserController {
  async createNewUser(req: Request, res: Response): Promise<Response> {
    const { name, email, password, confirmPassword } = req.body

    const createNewUserService = container.resolve(CreateNewUserService)
    const newUser = await createNewUserService.execute({
      name,
      email,
      password,
      confirmPassword,
    })
    try {
      const createDefaultMessageService = container.resolve(CreateDefaultMessageService)

      await createDefaultMessageService.execute({
        userId: newUser?._id.toString(),
      })

      return res.status(201).json({
        success: true,
        item: newUser,
        message: 'Usuário cadastrado com sucesso',
      })
    } catch (error) {
      return res.status(201).json({
        success: true,
        item: newUser,
        message: 'Usuário criado, mas não foi possível cadastrar a mensagem. Por favor, entre em contato com o suporte.',
      })
    }
  }
}
