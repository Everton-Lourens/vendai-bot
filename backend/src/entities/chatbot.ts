import mongoose, { Types } from 'mongoose'

export interface Client {
  userId: string;
  clientId: string;
  stage: number;
  message: string;
}

export interface Message {
  _id: Types.ObjectId | string
  text: string
  stage: number
  position: number
  user: string
  isDefault: boolean
  message: string;
  userId: string;
  clientId: string;
  response: string;
  order: object | undefined;
}

const messageSchema = new mongoose.Schema({
  text: { type: String, default: null },
  stage: { type: Number, default: null },
  position: { type: Number, default: null },
  user: { type: 'ObjectId', ref: 'User', default: null },
  isDefault: { type: Boolean, default: false },
})

export const MessageModel = mongoose.model<Message>('Message', messageSchema)
