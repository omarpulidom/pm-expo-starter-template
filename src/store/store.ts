import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { zustandMMKVStorage } from '@/lib/mmkv'
import { createAuthSlice } from './auth.store'
import type { GlobalStoreType } from './types'

const MAIN_STORE_NAME_PERSIST = 'zustand-main-stores'

type PersistedAuthState = Pick<GlobalStoreType['auth'], 'user' | 'accessToken' | 'refreshToken'>

type PersistedState = {
  auth: PersistedAuthState
}

export const useGlobalStore = create<GlobalStoreType>()(
  persist(
    (...args) => ({
      auth: createAuthSlice(...args),
    }),
    {
      name: MAIN_STORE_NAME_PERSIST,
      storage: createJSONStorage(() => zustandMMKVStorage),
      partialize(state): PersistedState {
        return {
          auth: {
            user: state.auth.user,
            accessToken: state.auth.accessToken,
            refreshToken: state.auth.refreshToken,
          },
        }
      },
      merge: (persistedState: unknown, currentState: GlobalStoreType): GlobalStoreType => {
        const persisted = persistedState as PersistedState | undefined

        return {
          ...currentState,
          auth: {
            ...currentState.auth,
            user: persisted?.auth?.user ?? currentState.auth.user,
            accessToken: persisted?.auth?.accessToken ?? currentState.auth.accessToken,
            refreshToken: persisted?.auth?.refreshToken ?? currentState.auth.refreshToken,
          },
        }
      },
    },
  ),
)
