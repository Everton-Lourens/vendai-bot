import { IClient } from './IClient'

export interface IMessage {
  stage: number
  _id: string
  date: Date
  position: number
  client: IClient
  status: string
}
