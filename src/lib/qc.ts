import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query'
import { persistQueryClient } from '@tanstack/react-query-persist-client'
import { clientStorage } from './mmkv'

const clientPersister = createSyncStoragePersister({
  storage: clientStorage,
})

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: LogErrors,
  }),
  mutationCache: new MutationCache({
    onError: LogErrors,
  }),
  defaultOptions: {
    queries: {
      retry: 1,
    },
  },
})

function LogErrors(e: Error) {
  console.log('ERROR ---------------___>', e.message)
  console.error(e)
}

persistQueryClient({
  queryClient,
  persister: clientPersister,
})

function WARNING_CLEAR_QUERY_CLIENT() {
  queryClient.clear()
  console.warn('Cleared all queries')
}

export { queryClient, WARNING_CLEAR_QUERY_CLIENT }
