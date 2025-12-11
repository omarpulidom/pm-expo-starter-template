import ky from 'ky'
import { RefreshTokenResponseSchema } from '@/api/Users/Users.Schemas'
import { Constants, type ENDPOINTS } from '@/lib/Constants'
import { queryClient } from '@/lib/qc'
import { useGlobalStore } from '@/store'

const authHttp = ky.create({
  prefixUrl: `${Constants.API_URL}${Constants.ENDPOINTS.AUTH}`,
  headers: {
    'Content-Type': 'application/json',
  },
  throwHttpErrors: true,
})

let refreshPromise: Promise<string | null> | null = null

async function performTokenRefresh(): Promise<string | null> {
  const store = useGlobalStore.getState()
  const refreshToken = store.auth.refreshToken

  if (!refreshToken) {
    store.auth.logOut()
    queryClient.clear()
    return null
  }

  try {
    const response = await authHttp
      .post('refreshToken', {
        json: {
          refreshToken,
        },
        headers: {
          'Refresh-Token': refreshToken,
        },
      })
      .json()

    const parsed = RefreshTokenResponseSchema.parse(response)
    const tokens = parsed.data

    store.auth.setAccessToken(tokens.accessToken)
    // store.auth.setRefreshToken(tokens.refreshToken)

    return tokens.accessToken
  } catch (error) {
    console.warn('Failed to refresh access token', error)
    store.auth.logOut()
    queryClient.clear()
    return null
  }
}

function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = performTokenRefresh().finally(() => {
      refreshPromise = null
    })
  }

  return refreshPromise
}

export const req = ky.create({
  prefixUrl: Constants.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  hooks: {
    beforeRequest: [
      async (request) => {
        const globalState = useGlobalStore.getState()
        const userToken = globalState.auth.accessToken
        const refreshToken = globalState.auth.refreshToken
        if (userToken) {
          request.headers.set('Authorization', `Bearer ${userToken}`)
        }
        if (refreshToken) {
          request.headers.set('Refresh-Token', refreshToken)
        }
        return request
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        if (response.status !== 401) {
          return response
        }

        const requestUrl = new URL(request.url)
        const isAuthLogin = requestUrl.pathname.endsWith('/auth/login')
        const isAuthRefresh = requestUrl.pathname.endsWith('/auth/refreshToken')

        if (isAuthLogin || isAuthRefresh) {
          return response
        }

        if (request.headers.get('X-Auth-Retry') === '1') {
          return response
        }

        const accessToken = await refreshAccessToken()

        if (!accessToken) {
          return response
        }

        const headers = new Headers(options.headers)
        headers.set('Authorization', `Bearer ${accessToken}`)
        headers.set('X-Auth-Retry', '1')

        return req(request, {
          ...options,
          headers,
        })
      },
    ],
  },
  throwHttpErrors: true,
})

export function createServiceHandler(endpoint: ENDPOINTS) {
  return req.extend((parentOptions) => {
    return {
      ...parentOptions,
      prefixUrl: `${parentOptions.prefixUrl}${endpoint}`,
    }
  })
}
