import { Request, Response } from 'express'

export class TokenController {
  async checkToken(req: Request, res: Response): Promise<Response> {
    return res.status(200).json({ success: true, status: 200, message: 'Token válido' })
  }
}
