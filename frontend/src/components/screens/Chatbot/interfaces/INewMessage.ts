import { z } from 'zod'

export const newMessageSchema = z.object({
  _id: z.string().optional(),
  text: z.string().min(1, 'Nome não informado'),
  position: z.number().min(1, 'Insira uma quantidade maior do que zero'),
  isDefault: z.boolean(),
})

export type INewMessage = z.infer<typeof newMessageSchema>
