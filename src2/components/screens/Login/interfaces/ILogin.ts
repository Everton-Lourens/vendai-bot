import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string(),
  password: z.string(),
})

export type ILogin = z.infer<typeof loginSchema>
