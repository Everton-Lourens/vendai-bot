import { z } from 'zod'

export const registerSchema = z.object({
  email: z.string(),
  password: z.string(),
  confirmPassword: z.string(),
})

export type IRegister = z.infer<typeof registerSchema>
