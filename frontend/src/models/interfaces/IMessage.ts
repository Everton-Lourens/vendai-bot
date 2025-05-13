import { IClient } from './IClient'
import { IProduct } from './IProduct'
import { IChatbot } from './IChatbot'

export interface IMessage {
  _id: string
  date: Date
  stage: number
  client: IClient
  status: string
  products: IProduct[]
  chatbot: IChatbot[]
}
