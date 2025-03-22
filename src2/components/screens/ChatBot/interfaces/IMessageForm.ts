import { z } from 'zod'

export const messageFormSchema = z.object({
  message: z.string(),
})

export type IMessageForm = z.infer<typeof messageFormSchema>
