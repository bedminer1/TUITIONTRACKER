import { z } from "zod"

export const userFormSchema = z.object({
    phoneNumber: z.string().min(8).max(8),
    password: z.string().min(2).max(50),
})

export type UserFormSchema = typeof userFormSchema