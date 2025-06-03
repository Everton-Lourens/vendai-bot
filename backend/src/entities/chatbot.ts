import mongoose, { Types } from 'mongoose'
import { Client } from 'pg'

export interface Chatbot {
  _id: Types.ObjectId | string
  name: string
  phone: string
  user: string
  stage: number
  position: number
  messages: Message[]
}

export interface Order {
  humanAttendant: false
  items: []
  address: null
}

export interface ChatbotClient {
  userId: string
  clientId: string
  stage: number
  message: string
  order: Order
  response: string
}

export interface Message {
  text: string
  stage: number
  position: number
  isDefault: boolean
  message: string
  userId: string
  clientId: string
  response: string
  order: object | undefined
}

const messageSchema = new mongoose.Schema({
  text: { type: String, default: null },
  stage: { type: Number, default: null },
  position: { type: Number, default: null },
  user: { type: 'ObjectId', ref: 'User', default: null },
  isDefault: { type: Boolean, default: false },
})

export const MessageModel = mongoose.model<Message>('Message', messageSchema)
