import mongoose, { Types } from 'mongoose'

export interface Message {
  _id: Types.ObjectId | string
  text: string
  stage: number
  code: string
  user: string
  isDefault: boolean
  amount?: number
}

const messageSchema = new mongoose.Schema({
  code: { type: String, default: null },
  text: { type: String, default: null },
  stage: { type: Number, default: null },
  user: { type: 'ObjectId', ref: 'User', default: null },
  isDefault: { type: Boolean, default: false },
})

export const MessageModel = mongoose.model<Message>('Message', messageSchema)
