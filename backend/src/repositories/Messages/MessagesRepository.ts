import { Model } from 'mongoose'
import { Message, MessageModel } from '../../entities/message'
import {
  INewMessageDTO,
  IMessagesRepository,
  FiltersListMessages,
  UpdateParams,
} from './IMessagesRepository'

export class MessagesRepository implements IMessagesRepository {
  model: Model<Message> = MessageModel
  async list({
    userId,
    searchString,
    onlyDefault,
  }: FiltersListMessages): Promise<Message[]> {
    const query = {
      user: userId,
      ...(searchString
        ? { text: { $regex: searchString, $options: 'i' } }
        : {}),
      ...(onlyDefault ? { isDefault: true } : {}),
    }
    return await MessageModel.find(query).lean()
  }

  async create({
    code,
    isDefault,
    stage,
    text,
    userId,
  }: INewMessageDTO): Promise<Message> {
    const newMessage = await this.model.create({
      code,
      isDefault,
      stage,
      text,
      user: userId,
    })
    await newMessage.save()

    return newMessage
  }

  async update({ filters, updateFields }: UpdateParams): Promise<void> {
    await this.model.updateOne(filters, updateFields)
  }

  async delete(idMessage: string): Promise<void> {
    await MessageModel.deleteOne({ _id: idMessage })
  }

  async findByName(text: string): Promise<Message> {
    return await MessageModel.findOne({ text }).lean()
  }

  async findById(messageId: string): Promise<Message> {
    return await MessageModel.findOne({ _id: messageId }).lean()
  }

  async getEntries(userId: string): Promise<number> {
    return MessageModel.countDocuments({ user: userId }).lean()
  }
}
