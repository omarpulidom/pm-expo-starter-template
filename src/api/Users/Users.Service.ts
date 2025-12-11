import { Constants } from '@/lib/Constants'
import { createServiceHandler } from '../req'
import {
  type RefreshTokenResponse,
  RefreshTokenResponseSchema,
  type UserLoginRequestBody,
  type UserLoginResponse,
  UserLoginResponseSchema,
  type UserMeResponse,
  UserMeResponseSchema,
} from './Users.Schemas'

const UserNet = createServiceHandler(Constants.ENDPOINTS.AUTH)

export class UsersService {
  static async login(params: UserLoginRequestBody): Promise<UserLoginResponse> {
    const data = await UserNet.post('login', {
      json: {
        email: params.email,
        password: params.password,
      },
    }).json()

    return UserLoginResponseSchema.parse(data)
  }

  static async me(): Promise<UserMeResponse> {
    const data = await UserNet.get('me').json()

    return UserMeResponseSchema.parse(data)
  }

  static async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const data = await UserNet.post('refresh', {
      json: {
        refreshToken,
      },
      headers: {
        'Refresh-Token': refreshToken,
      },
    }).json()

    return RefreshTokenResponseSchema.parse(data)
  }
}
