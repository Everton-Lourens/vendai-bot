import { Model } from 'mongoose'
import { Message, MessageModel } from '../../entities/message'
import {
  INewMessageDTO,
  IMessagesRepository,
  FiltersListMessages,
  UpdateParams,
} from './IMessagesRepository'

import allDefaultMessages from '../../config/defaultMessages/defaultMessages'

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

  async createDefault({ userId }: { userId: string }): Promise<Message[]> {
    const formatted = allDefaultMessages.map(({ stage, position, text }) => ({
      stage,
      position,
      text,
      isDefault: (stage === 0 && position === 1 ? true : false),
      user: userId,
    }));

    return await this.model.create(formatted);
  }


  async create({
    isDefault,
    stage,
    position,
    text,
    userId,
  }: INewMessageDTO): Promise<Message> {
    const newMessage = await this.model.create({
      isDefault,
      stage,
      position,
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
