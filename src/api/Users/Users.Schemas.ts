import z from 'zod'
import { CreateResponseSchema, CreateSchemaWithId } from '../req.helpers'

export const BaseUserSchema = CreateSchemaWithId({
  firstName: z.string(),
  lastName: z.string(),
  email: z.email(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type BaseUser = z.infer<typeof BaseUserSchema>

export type UserLoginRequestBody = {
  email: string
  password: string
}

export const WithAccessTokens = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
})

export const UserLoginResponseSchema = CreateResponseSchema(
  WithAccessTokens.extend({
    user: BaseUserSchema,
  }),
)

export const UserMeResponseSchema = CreateResponseSchema(BaseUserSchema)

export const RefreshTokenResponseSchema = CreateResponseSchema(
  WithAccessTokens.omit({
    refreshToken: true,
  }),
)

export type AuthTokens = z.infer<typeof WithAccessTokens>
export type UserLoginResponse = z.infer<typeof UserLoginResponseSchema>
export type UserMeResponse = z.infer<typeof UserMeResponseSchema>
export type RefreshTokenResponse = z.infer<typeof RefreshTokenResponseSchema>
