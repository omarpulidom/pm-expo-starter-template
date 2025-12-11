import { type UseQueryOptions, useMutation, useQuery } from '@tanstack/react-query'
import type { UserMeResponse } from './Users.Schemas'
import { UsersService } from './Users.Service'

export class UsersHooks {
  static KEYS = {
    login: [
      'users',
      'login',
    ] as const,
    me: [
      'users',
      'me',
    ] as const,
  }

  static useLogin() {
    return useMutation({
      mutationKey: UsersHooks.KEYS.login,
      mutationFn: UsersService.login,
    })
  }

  static useMe(options?: Omit<UseQueryOptions<UserMeResponse>, 'queryKey' | 'queryFn'>) {
    return useQuery({
      queryKey: UsersHooks.KEYS.me,
      queryFn: UsersService.me,
      ...options,
    })
  }
}
