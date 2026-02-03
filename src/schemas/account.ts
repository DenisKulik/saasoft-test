import { z } from "zod"

export const labelSchema = z
  .string()
  .max(50, "Метка не должна превышать 50 символов")
  .optional()
  .nullable()
  .transform((v) => v ?? "")

export const loginSchema = z
  .string()
  .min(1, "Логин обязателен")
  .max(100, "Логин не должен превышать 100 символов")
  .trim()

const passwordSchema = z.string().max(100, "Пароль не должен превышать 100 символов").nullable().optional()

export const createAccountSchema = () => {
  return z
    .object({
      label: labelSchema,
      accountType: z.enum(["LDAP", "Локальная"]),
      login: loginSchema,
      password: passwordSchema,
    })
    .superRefine(({ accountType, password }, ctx) => {
      if (accountType === "Локальная" && (!password || password.trim().length === 0)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["password"],
          message: "Пароль обязателен для локальной учетной записи",
        })
      }
    })
}

export type AccountFormValues = z.infer<ReturnType<typeof createAccountSchema>>
