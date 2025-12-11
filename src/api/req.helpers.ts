import type { HTTPError } from 'ky'
import z, { type ZodError } from 'zod'

export function CreateResponseSchema<T extends z.ZodSchema>(schema: T) {
  return z.object({
    data: schema,
    message: z.string().optional().nullable(),
    success: z.coerce.boolean().default(false),
  })
}

export function CreateSchemaWithId<T extends z.ZodRawShape>(schema: T) {
  return z
    .object({
      id: z.string(),
      // createdAt: z.coerce.date(),
      // updatedAt: z.coerce.date(),
      // status: z.coerce.boolean(),
    })
    .extend(schema)
}

export const GeneralMessageSchema = z.object({
  message: z.string(),
})

export type ReqErrors = ZodError | HTTPError

export function getJsonMessage(responseJsonError: unknown) {
  if (!responseJsonError) return null
  if (typeof responseJsonError !== 'object') return null
  if ('message' in responseJsonError && typeof responseJsonError.message === 'string') {
    return responseJsonError.message
  }
  return null
}
