import { useQueryClient } from '@tanstack/react-query'
import type { Route } from 'expo-router'
import { useRouter } from 'expo-router'
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { UsersHooks } from '@/api/Users/Users.Hooks'
import type {
  BaseUser,
  RefreshTokenResponse,
  UserLoginRequestBody,
  UserLoginResponse,
} from '@/api/Users/Users.Schemas'
import { UsersService } from '@/api/Users/Users.Service'
import { RedirectError } from '@/lib/Errors'
import { useGlobalStore } from '@/store'

const DEFAULT_LOGIN_ROUTE: Route = '/(auth)/login'

type RequireAuthOptions = {
  redirectTo?: Route
  message?: string
}

type AuthContextValue = {
  user: BaseUser | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isInitializing: boolean
  isLoggingIn: boolean
  loginError: unknown
  isRefreshing: boolean
  isFetchingUser: boolean
  login: (payload: UserLoginRequestBody) => Promise<UserLoginResponse['data']>
  logout: () => void
  refresh: () => Promise<RefreshTokenResponse['data'] | null>
  fetchCurrentUser: () => Promise<BaseUser | null>
  requireAuth: (options?: RequireAuthOptions) => boolean
  userOrThrow: (options?: RequireAuthOptions) => BaseUser
  mockLogin: () => void // DEV: Simulates an authenticated user without backend
}

const AuthContext = createContext<AuthContextValue | null>(null)

type AuthProviderProps = {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isInitializing, setIsInitializing] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const router = useRouter()
  const user = useGlobalStore((state) => state.auth.user)
  const accessToken = useGlobalStore((state) => state.auth.accessToken)
  const refreshToken = useGlobalStore((state) => state.auth.refreshToken)
  const setUser = useGlobalStore((state) => state.auth.setUser)

  const setAccessToken = useGlobalStore((state) => state.auth.setAccessToken)
  const setRefreshToken = useGlobalStore((state) => state.auth.setRefreshToken)
  const logOutFromStore = useGlobalStore((state) => state.auth.logOut)

  const queryClient = useQueryClient()

  const {
    mutateAsync: loginRequest,
    isPending: isLoggingIn,
    error: loginError,
    reset: resetLoginMutation,
  } = UsersHooks.useLogin()

  const { refetch: refetchCurrentUser, isFetching: isFetchingUser } = UsersHooks.useMe({
    enabled: false,
    retry: 0,
  })

  const logout = useCallback(() => {
    logOutFromStore()
    queryClient.clear()
    resetLoginMutation()
    setIsInitializing(false)
    router.replace('/(auth)/login')
  }, [
    logOutFromStore,
    queryClient,
    resetLoginMutation,
    router,
  ])

  const login = useCallback(
    async (payload: UserLoginRequestBody) => {
      const response = await loginRequest(payload)
      const {
        accessToken: nextAccessToken,
        refreshToken: nextRefreshToken,
        user: nextUser,
      } = response.data

      setAccessToken(nextAccessToken)
      setRefreshToken(nextRefreshToken)
      setUser(nextUser)
      setIsInitializing(false)

      return response.data
    },
    [
      loginRequest,
      setAccessToken,
      setRefreshToken,
      setUser,
    ],
  )

  // DEV: Mock login to work without backend
  const mockLogin = useCallback(() => {
    const mockUser: BaseUser = {
      id: 'mock-user-id',
      firstName: 'User',
      lastName: 'Test',
      middleName: 'Mock',
      phone: '5551234567',
      email: 'mock@example.com',
      avatarUrl: null,

      roles: [
        {
          role: 'patient',
          modules: [],
        },
      ],
      accessLevel: 'PA',
      gender: 'M',
      birthDate: '1990-01-01',

      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    console.log('🔧 DEV: Mock login activated')
    setUser(mockUser)
    setAccessToken(`mock-access-token-${Date.now()}`)
    setRefreshToken(`mock-refresh-token-${Date.now()}`)
    setIsInitializing(false)
  }, [
    setUser,
    setAccessToken,
    setRefreshToken,
  ])

  const fetchCurrentUser = useCallback(async () => {
    if (!setUser) {
      return null
    }
    console.log('Fetching current user...')
    const result = await refetchCurrentUser()
    if (result.error) {
      console.log('Error fetching current user:', result.error)
      throw result.error
    }
    const userData = result.data?.data ?? null
    if (userData) {
      console.log('Fetched current user:', userData)
      setUser(userData)
    }
    return userData
  }, [
    refetchCurrentUser,
    setUser,
  ])

  const refresh = useCallback(async () => {
    if (!setAccessToken) {
      return null
    }
    if (!refreshToken) {
      logout()
      return null
    }

    setIsRefreshing(true)
    try {
      const response = await UsersService.refreshToken(refreshToken)
      const tokens = response.data

      setAccessToken(tokens.accessToken)
      console.log('Refreshed access token')

      return tokens
    } catch (error) {
      console.warn('Unable to refresh access token', error)
      logout()
      return null
    } finally {
      setIsRefreshing(false)
    }
  }, [
    refreshToken,
    setAccessToken,
    logout,
  ])

  const userOrThrow = useCallback(
    (options: RequireAuthOptions = {}) => {
      if (!user) {
        throw new RedirectError(
          options.redirectTo ?? DEFAULT_LOGIN_ROUTE,
          options.message ?? 'Please sign in to continue',
        )
      }

      return user
    },
    [
      user,
    ],
  )

  useEffect(() => {
    let isMounted = true

    const bootstrap = async () => {
      if (!accessToken || !refreshToken) {
        if (isMounted) {
          setIsInitializing(false)
        }
        return
      }

      // DEV: If using mock tokens, skip backend validation
      if (accessToken.startsWith('mock-access-token')) {
        console.log('🔧 DEV: Mock token detected, skipping backend validation')
        if (isMounted) {
          setIsInitializing(false)
        }
        return
      }

      try {
        await fetchCurrentUser()
      } catch (error) {
        try {
          const tokens = await refresh()
          if (!tokens) {
            throw error
          }
          await fetchCurrentUser()
        } catch (refreshError) {
          logout()
          console.warn('Failed to initialize auth context', refreshError)
        }
      } finally {
        if (isMounted) {
          setIsInitializing(false)
        }
      }
    }

    bootstrap()

    return () => {
      isMounted = false
    }
  }, [
    accessToken,
    refreshToken,
    fetchCurrentUser,
    refresh,
    logout,
  ])

  const requireAuth = useCallback(
    (options: RequireAuthOptions = {}) => {
      if (isInitializing) {
        return false
      }

      if (!user) {
        throw new RedirectError(
          options.redirectTo ?? DEFAULT_LOGIN_ROUTE,
          options.message ?? 'Please sign in to continue',
        )
      }

      return true
    },
    [
      user,
      isInitializing,
    ],
  )

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      accessToken,
      refreshToken,
      isAuthenticated: Boolean(user),
      isInitializing,
      isLoggingIn,
      loginError,
      isRefreshing,
      isFetchingUser,
      login,
      logout,
      refresh,
      fetchCurrentUser,
      requireAuth,
      userOrThrow,
      mockLogin,
    }),
    [
      user,
      accessToken,
      refreshToken,
      isInitializing,
      isLoggingIn,
      loginError,
      isRefreshing,
      isFetchingUser,
      login,
      logout,
      refresh,
      fetchCurrentUser,
      requireAuth,
      userOrThrow,
      mockLogin,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
